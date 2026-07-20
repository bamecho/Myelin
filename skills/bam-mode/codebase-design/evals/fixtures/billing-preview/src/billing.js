import { normalizeInvoice } from "./normalize.js";
import { selectBillable } from "./select.js";

export async function billInvoices(invoices, gateway) {
  const billable = selectBillable(invoices.map(normalizeInvoice));
  for (const invoice of billable) {
    await gateway.charge(invoice.id, invoice.amount);
  }
  return billable.length;
}
