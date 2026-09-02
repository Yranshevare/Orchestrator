import { spawn } from "node:child_process";
import { PROJECT_DIR } from "../constant";



export default async function* AgentRunner({ agent, task }: { agent: { name: string; cmd: string; when: string }; task: string }) {
    try {
        const [command, ...args]: string[] = agent.cmd.split(" ");
        if (!command) {
            throw new Error("Invalid agent command");
        }

        const child = await spawn(command, [...args], {
            stdio: ["pipe", "pipe", "pipe"],
            cwd: PROJECT_DIR
        });

        child.stdin.write(task + "\n");
        child.stdin.end();

        for await (const chunk of child.stdout) {
            console.log(chunk.toString());
            yield chunk.toString();
        }
        
        child.stderr.on("data", (data) => console.error(data.toString()));
    } catch (error) {
        yield "Error: " + (error as Error).message;
    }
}
