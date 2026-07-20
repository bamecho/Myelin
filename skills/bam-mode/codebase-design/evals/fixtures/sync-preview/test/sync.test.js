import test from "node:test";
import assert from "node:assert/strict";
import { syncSessions } from "../src/sync.js";

test("execution uses the shared ordered plan", async () => {
  const calls = [];
  const count = await syncSessions([
    { id: "b", active: true, operation: "update" },
    { id: "off", active: false, operation: "delete" },
    { id: "a", active: true, operation: "create" }
  ], { apply: async (operation, id) => calls.push({ operation, id }) });

  assert.equal(count, 2);
  assert.deepEqual(calls, [
    { operation: "create", id: "a" },
    { operation: "update", id: "b" }
  ]);
});
