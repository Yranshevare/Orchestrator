function parseFlags(params: string[]): Record<string, string> {
    const result: Record<string, string> = {};

    let currentFlag: string | null = null;

    for (const token of params) {
        if (token.startsWith("--")) {
            currentFlag = token.slice(2);
            result[currentFlag] = "";
        } else if (currentFlag) {
            result[currentFlag] += (result[currentFlag] ? " " : "") + token;
        }
    }

    return result;
}

export default parseFlags;