type handler = {status: number, success: boolean, message: string, data?: any};

interface commandType {
    command: string;
    description: string;
    handler: (params: string[]) => Promise<handler>;
}

export type{commandType, handler};