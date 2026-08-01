import fs from "fs";
import path from "path";
import { SETTINGS_PATH } from "../constant";

export async function read(filePath: string = SETTINGS_PATH) {
    if (!fs.existsSync(filePath)) {
        return { status: 404, success: false, message: "File does not exist.", error: "File not found" };
    }
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return { status: 200, success: true, message: "Data read successfully", data: data };
    } catch (error) {
        return { status: 500, success: false, message: "Error reading the file.", error: (error as Error).message };
    }
}
