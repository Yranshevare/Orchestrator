import { Parser, Language } from "web-tree-sitter";
import path from "node:path";

let parser: Parser | null = null;

export async function initializeParser(): Promise<void> {
  if (parser) return;

  await Parser.init();

  const wasmPath = path.resolve(
    process.cwd(),
    "node_modules/tree-sitter-wasms/out/tree-sitter-typescript.wasm"
  );

  const language = await Language.load(wasmPath);

  parser = new Parser();
  parser.setLanguage(language);
}

export function parseTypeScript(sourceCode: string): Parser.Tree {
  if (!parser) {
    throw new Error(
      "Parser has not been initialized. Call initializeParser() first."
    );
  }

  return parser.parse(sourceCode);
}