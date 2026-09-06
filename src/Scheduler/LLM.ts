import provider from "../util/provider";
import { read } from "../util/read";

async function LoadModel() {
    const settingsString = await read();

    if (!settingsString.success) {
        throw Error(settingsString.error);
    }

    const settings = JSON.parse(settingsString.data as string);

    const model = provider[settings.model.provider]?.getLLM(settings.model.name, settings.model.api_key);

    if (!model) {
        throw Error("Model not found");
    }

    return model;
}

export default LoadModel;
