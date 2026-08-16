import provider from "../util/provider";

export default function LLM(settings: { provider: string; api_key: string; name: string }) {
    const model = provider[settings.provider]?.getLLM(settings.name, settings.api_key);
    return model;
}
