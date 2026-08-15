import { scanRepository } from "./ingestion/scanner";

const repositoryPath = process.cwd();

const files = await scanRepository(repositoryPath);

console.log(`Found ${files.length} files:\n`);

for (const file of files) {
  console.log(
    `${file.relativePath} | ${file.extension} | ${file.size} bytes`
  );
}