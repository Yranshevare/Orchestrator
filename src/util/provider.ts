type providerType = {
    name: string,
    listModel: (key?: string) => string[]
}


const provider: Record<string, providerType> = {
    ollama: {
        name: "Ollama",
        listModel: ()=>{
            return ["model1", "model2", "model3"];
        }
    },
    openAI:{
        name: "OpenAI",
        listModel: ()=>{
            return ["model4", "model5", "model6"];
        }
    },
    gemini:{
        name: "Gemini",
        listModel: ()=>{
            return ["model7", "model8", "model9"];
        }
    }    
}

export default provider