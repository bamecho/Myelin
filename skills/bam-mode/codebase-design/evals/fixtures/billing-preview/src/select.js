export function selectBillable(invoices) {
  return invoices.filter((invoice) => invoice.status === "open" && invoice.amount > 0);
}
