# Approved spec: billing preview

- Add a public `previewBilling(invoices)` API.
- It returns the exact `{ id, amount }` charge plan used by `billInvoices`
  without performing charges.
- Existing consumers remain backward compatible.

Non-goals: change invoice validation, selection, or payment behavior.
