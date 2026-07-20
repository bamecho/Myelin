import test from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/cli.js";

const input = JSON.stringify([
  { id: "b", active: true, operation: "update" },
  { id: "off", active: false, operation: "delete" },
  { id: "a", active: true, operation: "create" }
]);

test("dry-run prints the shared plan without calling the client", async () => {
  const output = [];
  await run(["--dry-run", "records.json"], {
    readFile: async () => input,
    client: { apply: async () => assert.fail("dry-run called client") },
    stdout: (line) => output.push(line)
  });
  assert.deepEqual(output, ["create:a", "update:b"]);
});
