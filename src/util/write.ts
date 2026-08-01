import fs from "fs";
import path from "path";
import { SETTINGS_PATH } from "../constant";

export async function write(data: string, filePath: string = SETTINGS_PATH) {
    console.log("cwd:", process.cwd());
    console.log("resolved:", path.resolve(filePath));
    try {
        const dir = path.dirname(filePath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, data, "utf8");

        return {
            status: 200,
            success: true,
            message: "Data written successfully",
        };
    } catch (error) {
        return {
            status: 500,
            success: false,
            message: "Error writing to the file.",
            error: (error as Error).message,
        };
    }
}
