import React, { createContext, useContext, useMemo, useState } from "react";
import { useAgentContext } from "./AgentProvider";
import { useSettingsContext } from "./SettingsProvider";
import AgentRunner from "../Scheduler/AgentRunner";
import inject from "../contextEngine/inject";
import getContext from "../contextEngine/retrieve";
import { scheduleAgent } from "../Scheduler/scheduler";
import { eventOptions, events } from "../util/event";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type AppContextType = {
    messages: Message[];
    handleSubmit: (input: string) => void;
    agentResponse: string | null;
};

const AppContext = createContext<AppContextType | null>(null);

export default function PromptContext({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    // const [status, setStatus] = useState<string | null>(null);
    const [agentResponse, setAgentResponse] = useState<string | null>(null);

    const { selectedAgent, agents } = useAgentContext();
    const { commands, refreshSettings, settings } = useSettingsContext();
    // const { settings } = useSettingsContext();

    // run the respective handler for each command
    const handleSlashCommand = async (input: string) => {
        const [command, ...params] = input.trim().split(" ");

        const matchingCommand = commands.find((cmd) => cmd.command === command);

        if (matchingCommand) {
            const res = await matchingCommand.handler(params);
            refreshSettings();
            return matchingCommand.skipMessage ? { ...res, skipMessage: true } : res;
        }
        return { status: 404, success: false, message: "Command not found" };
    };

    const handleSubmit = async (input: string) => {
        const trimmedPrompt = input.trim();

        if (!trimmedPrompt) return;

        setMessages((prev) => [...prev, { role: "user", content: trimmedPrompt }]);

        if (trimmedPrompt.startsWith("/")) {
            const handled = await handleSlashCommand(trimmedPrompt);

            if (!handled || !handled.success || handled.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `${handled?.error ?? handled?.message ?? "cannot execute command, something went wrong"}`,
                    },
                ]);
                return;
            }
            if ("skipMessage" in handled && handled.skipMessage) {
                setMessages((prev) => prev.slice(0, -1));
                return;
            }

            if (handled.data) {
                const { message, data, ...rest } = handled;
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `${handled.message}\n\n${JSON.stringify(data, null, 2)}`,
                    },
                ]);
                return;
            }

            return;
        }

        if (settings.model.provider === "NA" || settings.model.name === "NA") {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Please add model, and to do that run /model command",
                },
            ]);
            return;
        }

        if (agents[selectedAgent]?.cmd === "NA" && agents[selectedAgent]?.when === "NA" && agents[selectedAgent]?.name === "NA") {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Please add agent, and to do that run /agent add command",
                },
            ]);
            return;
        }

        if (!agents[selectedAgent]) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "No agent selected",
                },
            ]);
            return;
        }

        // setAgentResponse(`gathering context...`);
        events.emit(eventOptions.Status, `gathering context`);


        const res = await getContext(trimmedPrompt);
        if (!res.agent) {
            setMessages((prev) => [...prev, { role: "assistant", content: `Direct answer:\n${res.message}` }]);
            setAgentResponse(null);
            events.emit(eventOptions.Status, null);
            return;
        }

        // setAgentResponse(`update query to: (${res.message})`);
        events.emit(eventOptions.Status, `${res.message}`);

        const agentState = {
            userPrompt: `user prompt: ${res.message}\navailable agent:${JSON.stringify(agents.map((agent) => ({ name: agent.name, capability: agent.when })))}`,
            executionStep: [],
            goalComplete: false,
            executionSummary: "",
            output: [],
            context: "",
        };
        // await scheduleAgent.invoke(agentState);

        let output = "";

        for await (const chunk of await scheduleAgent.stream(agentState)) {
            // console.log(chunk);
            //@ts-ignore
            if (chunk.scheduleNode?.goalComplete) {
                 //@ts-ignore
                console.log(chunk.scheduleNode.context);
                break;
            }
            //@ts-ignore
            if (chunk.scheduleNode?.executionStep.length > 0) {
                let str = "";
                //@ts-ignore
                chunk.scheduleNode.executionStep.forEach((job: { task: string; agent: string }) => {
                    str += job.agent + ": " + job.task + "\n\n";
                    // setAgentResponse(job.agent + ": " + job.task);
                });
                events.emit(eventOptions.Status, `Agents are Working`);
                setAgentResponse(str);
            }
            //@ts-ignore
            if (chunk.agentRunner?.output.length > 0) {
                let str = "";
                //@ts-ignore
                chunk.agentRunner.output.forEach((job: string) => {
                    str += job + "\n\n";
                    // setAgentResponse(job.agent + ": " + job.task);
                });
                events.emit(eventOptions.Status, `Thinking`);
                setAgentResponse(str);
            }

            //@ts-ignore
            if (chunk.updateExecutionSummary?.executionSummary) {
                //@ts-ignore
                output = chunk.updateExecutionSummary.executionSummary;
            }

            //@ts-ignore
            if (chunk.summaryNode?.executionSummary) {
                events.emit(eventOptions.Status, `Still working on it`);
                //@ts-ignore
                output = chunk.summaryNode.executionSummary;
            }
        }

        // let output = "";

        // for await (const chunk of AgentRunner({
        //     agent: agents[selectedAgent],
        //     task: res.message,
        // })) {
        //     output += chunk;
        //     // setAgentResponse(output);
        // }

        // setAgentResponse("saving the context...");

        // await inject(output, settings.model, trimmedPrompt);

        events.emit(eventOptions.Status, `saving the context`);

        await new Promise((resolve) => setTimeout(resolve, 10000)); // this will be agent call

        // setMessages((prev) => [...prev, { role: "assistant", content: res.message }]);   // log the prompt that given to schedular

        events.emit(eventOptions.Status, null);

        setMessages((prev) => [...prev, { role: "assistant", content: output }]);        // log the agent output
        setAgentResponse(null);
        return;
    };

    const value = useMemo<AppContextType>(
        () => ({
            messages,
            handleSubmit,
            agentResponse,
        }),
        [messages, handleSubmit, agentResponse]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function usePromptContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("usePromptContext must be used inside PromptContext");
    }

    return context;
}
