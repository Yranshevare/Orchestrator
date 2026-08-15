import type { Parser } from "web-tree-sitter";

export interface CodeChunk {
  type: string;
  name: string;
  parent?: string;

  startLine: number;
  endLine: number;

  content: string;
}

const CHUNK_NODE_TYPES = new Set([
  "function_declaration",
  "class_declaration",
  "method_definition",
  "interface_declaration",
  "type_alias_declaration",
  "enum_declaration",
]);

function getNodeName(node: Parser.SyntaxNode): string {
  const nameNode = node.childForFieldName("name");

  return nameNode?.text ?? "anonymous";
}

function getChunkType(node: Parser.SyntaxNode): string | null {
  switch (node.type) {
    case "function_declaration":
      return "function";

    case "class_declaration":
      return "class";

    case "method_definition":
      return "method";

    case "interface_declaration":
      return "interface";

    case "type_alias_declaration":
      return "type";

    case "enum_declaration":
      return "enum";

    default:
      return null;
  }
}

export function extractChunks(
  tree: Parser.Tree,
  sourceCode: string
): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  function walk(
    node: Parser.SyntaxNode,
    parentName?: string
  ): void {
    if (CHUNK_NODE_TYPES.has(node.type)) {
      const type = getChunkType(node);

      if (!type) return;

      const name = getNodeName(node);

      chunks.push({
        type,
        name,
        parent: type === "method" ? parentName : undefined,

        startLine: node.startPosition.row + 1,
        endLine: node.endPosition.row + 1,

        content: node.text,
      });

      if (type === "class") {
        for (const child of node.namedChildren) {
          walk(child, name);
        }
      }

      return;
    }

    for (const child of node.namedChildren) {
      walk(child, parentName);
    }
  }

  walk(tree.rootNode);

  return chunks;
}