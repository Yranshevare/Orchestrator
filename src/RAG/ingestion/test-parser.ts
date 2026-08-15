import {
  initializeParser,
  parseTypeScript,
} from "./parser";

import { extractChunks } from "./chunker";

const code = `
import { foo } from "./foo";

class AuthService {
  generateToken() {
    return "token";
  }

  verifyToken(token: string) {
    return true;
  }
}

function hello(name: string) {
  console.log(name);
}
`;

await initializeParser();

const tree = parseTypeScript(code);

const chunks = extractChunks(tree, code);

console.log(JSON.stringify(chunks, null, 2));