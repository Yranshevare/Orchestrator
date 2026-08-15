import { PROJECT_DIR } from "../constant";
import getLLM from "../util/LLM";
import provider from "../util/provider";

export default async function inject(input: string, settings: {name: string, provider: string, api_key: string}) {
    try {

        const model = provider[settings.provider]?.getLLM(settings.name, settings.api_key)

        if(!model) {
            throw new Error("Model not found")
        }
        console.log("injecting")

        const response = await model.invoke(input)
        console.log(response)

    } catch (error) {
        console.error(error)
    }
}