import test from "node:test";
import assert from "node:assert/strict";
import { billInvoices, previewBilling } from "../src/billing.js";

const invoices = [
  { id: " a ", amount: "10", status: "open" },
  { id: "b", amount: 0, status: "open" }
];

test("preview and execution share a charge plan", async () => {
  const plan = previewBilling(invoices);
  const charges = [];
  const count = await billInvoices(invoices, {
    charge: async (id, amount) => charges.push({ id, amount })
  });
  assert.deepEqual(plan, [{ id: "a", amount: 10 }]);
  assert.deepEqual(charges, plan);
  assert.equal(count, 1);
});
