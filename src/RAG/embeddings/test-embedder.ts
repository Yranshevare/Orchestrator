import { embedText } from "./embedder";

const text = `
function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
`;

const vector = await embedText(text);

console.log("Dimensions:", vector.length);
console.log("First 10 values:", vector.slice(0, 10));