
export type handler = {status: number, success: boolean, message: string, data?: any, error?: string};

export type commandType = {
    command: string;
    description: string;
    handler: (params: string[]) => Promise<handler>;
    isDev?: boolean,
    skipMessage?: boolean
}