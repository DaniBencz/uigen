#!/usr/bin/env node
/**
 * Hello World hook — runs before every file read (PreToolUse: Read).
 * Receives the tool input as JSON on stdin, prints a greeting, then exits 0
 * to allow the read to proceed (exit 1 would block it).
 */

const chunks = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(Buffer.concat(chunks).toString() || "{}");
  const filePath = input.file_path ?? input.path ?? "(unknown)";

  // Output a systemMessage to stdout — Claude Code displays this in the UI.
  process.stdout.write(JSON.stringify({ systemMessage: `[hello hook] About to read: ${filePath}` }) + "\n");

  process.exit(0);
});
