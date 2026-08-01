import fs from "fs";
import path from "path";
import filepath from "./filePath";

export async function write(filePath: string = filepath, data: string) {
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, data);
}