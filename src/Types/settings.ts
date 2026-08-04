type Agent = {
    cmd: string;
    when: string;
};

export type Agents = Record<string, Agent>;

export  type model = {
    provider: string;
    name: string;
    api_key: string;
};

export type SettingsState = {
    model: model;
    agents: Agents;
};
