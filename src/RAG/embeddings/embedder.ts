import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
console.log(ai)
const MODEL = "gemini-embedding-2";

export async function embedText(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: MODEL,
    contents: `task: code retrieval | query: ${text}`,
    config: {
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error("Gemini returned no embedding");
  }

  return embedding;
}

export async function embedTexts(
  texts: string[],
): Promise<number[][]> {
  const response = await ai.models.embedContent({
    model: MODEL,
    contents: texts.map(
      (text) => `title: none | text: ${text}`,
    ),
    config: {
      outputDimensionality: 768,
    },
  });

  const embeddings = response.embeddings?.map(
    (embedding) => embedding.values,
  );

  if (!embeddings || embeddings.length !== texts.length) {
    throw new Error("Gemini returned an unexpected number of embeddings");
  }

  return embeddings;
}