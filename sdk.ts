import { query } from "@anthropic-ai/claude-agent-sdk";

const prompt = "Hello Claude! Please introduce yourself and share a fun fact.";

for await (const message of query({
  prompt,
})) {
  console.log(JSON.stringify(message, null, 2));
}
