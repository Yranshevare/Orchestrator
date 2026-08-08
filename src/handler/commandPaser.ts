function parseFlags(params: string[], flags: string[]): Record<string, string> {
    const result: Record<string, string> = {};

    let key: string | null = null;

    params.forEach((arg) => {
        if (flags.includes(arg)) {
            key = arg.slice(2);     // remove first two "--" characters 
        }else if (key) {
            result[key] ? (result[key] += " " + arg) : (result[key] =  arg);
        }
    });

    return result;
}

export default parseFlags;