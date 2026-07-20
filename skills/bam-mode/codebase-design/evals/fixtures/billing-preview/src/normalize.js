export function normalizeInvoice(invoice) {
  if (!invoice || typeof invoice.id !== "string") {
    const error = new TypeError("invoice.id must be a string");
    error.code = "INVALID_INVOICE_ID";
    throw error;
  }
  return {
    id: invoice.id.trim(),
    amount: Number(invoice.amount),
    status: invoice.status ?? "open"
  };
}
