import type { handler } from "./Type";

async function exit(params: string[]): Promise<handler> {
    process.stdout.write("\x1Bc");
    process.exit(0);
    return {status:200, success:true, message:"Exiting the application..."};
}

const ExitCommand = {
    command: "/exit",
    description: "Exit the application",
    handler: exit,
};

export default ExitCommand;