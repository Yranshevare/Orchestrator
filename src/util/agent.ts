import { read } from "./read";

type responseType = Promise<{
    status: number;
    success: boolean;
    message: string;
    data?: { name: string; provider: string; api_key: string };
    error?: string;
}>;

export default async function AgentData(): responseType {
    const settingsString = await read();
    if (!settingsString.success)
        return {
            status: 500,
            success: false,
            message: "agents not found",
            error: settingsString.error,
        };
    const settings = JSON.parse(settingsString.data as string);
    return {
        status: 200,
        success: true,
        message: "Agent data fetched successfully",
        data: settings.model,
    };
}
