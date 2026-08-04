import { spawn } from "node:child_process";

// function createDummyResponse(prompt: string) {
//     const responses = [
//         "That sounds like a solid task. I can help you tackle it step by step.",
//         "Here is a practical approach to get you moving quickly.",
//         "I will draft a simple plan and keep the implementation lightweight.",
//         "This looks doable. I will suggest a focused solution for now.",
//     ];

//     const randomReply = responses[Math.floor(Math.random() * responses.length)];

//     const trimmedPrompt = prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;

//     return `${randomReply} You asked: "${trimmedPrompt}"`;
// }

export default async function* AgentRunner({ agent, task }: { agent: { name: string; cmd: string; when: string }; task: string }) {
    try {
        const [command, ...args]: string[] = agent.cmd.split(" ");
        if (!command) {
            throw new Error("Invalid agent command");
        }

        const child = spawn(command, [...args, task], {
            stdio: ["ignore", "pipe", "pipe"],
        });

        for await (const chunk of child.stdout) {
            console.log(chunk.toString());
            yield chunk.toString();
        }
    } catch (error) {
        yield "Error: " + (error as Error).message;
    }
}
