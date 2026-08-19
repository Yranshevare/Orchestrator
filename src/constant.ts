import os from "os";
import path from "path";

export const GLOBAL_DIR = path.join(os.homedir(), ".orchestrator");
export const SETTINGS_PATH = path.join(GLOBAL_DIR, "settings.json");

export let PROJECT_DIR: string;

if(process.env.RUNTIME === "dev") {
    PROJECT_DIR = path.join(process.cwd(), "/demo/.orchestrator");
}else{
    PROJECT_DIR = path.join(process.cwd(), ".orchestrator");
}

export const PROJECT_CONFIG = path.join(PROJECT_DIR, "config.json");
export const COMPRESSED_JSON = path.join(PROJECT_DIR, "compressed.json");
export const CONTEXT_DB = path.join(PROJECT_DIR, "context.db");
export const SESSION_JSON = path.join(PROJECT_DIR, "session.json");

export const keys = {
    agents: "agents",
    cmd: "cmd",
    when: "when",
}

export const files = {
    context:"context.json",
}

export const SESSION_SIZE = 5;