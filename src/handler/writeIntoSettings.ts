import { keys } from "../constant";
import { read } from "../util/read";
import { write } from "../util/write";

export default async function writeIntoSettings({ key, data }: { key: string; data: any }) {
    try {
        const existingData = await read();

        if (!existingData.success && existingData.status !== 404) {
            return {
                status: 500,
                success: false,
                message: data.message,
                error: data.error,
            };
        }

        const settings = existingData.success ? JSON.parse(existingData?.data || "{}") : {};

        // check if agent already exit or not
        const agentName: string = Object.keys(data)[0] || "";

        if (key === keys.agents && settings[key][agentName]) {
            return {
                status: 400,
                success: false,
                message: "Agent already exists.",
            };
        }

        settings[key] = settings[key] ? { ...settings[key], ...data } : { ...data };

        const res = await write(JSON.stringify(settings, null, 2));

        // console.log("writeIntoSettings res:", res);

        if (!res.success) {
            return {
                status: 500,
                success: false,
                message: res.message,
                error: res.error || "Error writing to the settings file.",
            };
        }

        return { status: 200, success: true, message: "Data written successfully", data: settings };
    } catch (error) {
        console.log("writeIntoSettings error:", error);
        return { status: 500, success: false, message: "Error writing to the settings file.", error: (error as Error).message };
    }
}
