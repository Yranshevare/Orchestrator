export default function parseModelJSON(content: string) {
    let cleaned = content.trim();

    // Remove markdown code fences
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Failed to parse model JSON:");
        console.error(content);

        throw new Error(`Model returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
}
