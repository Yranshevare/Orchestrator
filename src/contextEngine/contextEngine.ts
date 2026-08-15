import { PROJECT_DIR } from "../constant";
import RagAgent from "./agents";

export default async function contextEngine(input: string, model: string) {
    try {
        // console.log(PROJECT_DIR)
        console.log(await RagAgent())

    } catch (error) {
        
    }
}