import test from "node:test";
import assert from "node:assert/strict";
import { normalizeInvoice } from "../src/normalize.js";
import { selectBillable } from "../src/select.js";

test("published utility contracts remain independent", () => {
  assert.throws(
    () => normalizeInvoice({ amount: 10 }),
    (error) => error.code === "INVALID_INVOICE_ID"
  );
  assert.deepEqual(selectBillable([
    { id: "a", amount: 10, status: "open" },
    { id: "b", amount: 0, status: "open" }
  ]), [{ id: "a", amount: 10, status: "open" }]);
});
