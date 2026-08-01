import fs from "fs";
import path from "path";
import filepath from "./filePath";

export async function write(filePath: string = filepath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        return { status: 404, success: false, message: "Directory does not exist and could not be created." };
    }
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return { status: 200, success: true, message: "Data read successfully", data: data };
    } catch (error) {
        return { status: 500, success: false, message: "Error reading the file." };
    }
}
