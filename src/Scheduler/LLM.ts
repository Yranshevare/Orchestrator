import provider from "../util/provider";
import { read } from "../util/read";

const settingsString = await read();

if (!settingsString.success) {
    throw Error(settingsString.error);
}

const settings = JSON.parse(settingsString.data as string);

const model = provider[settings.model.provider]?.getLLM(settings.model.name, settings.model.api_key);

if (!model) {
    throw Error("Model not found");
}

export default model;
