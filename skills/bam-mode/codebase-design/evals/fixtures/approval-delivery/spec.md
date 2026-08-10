# Approved spec: reliable approval delivery

- Keep both current approval callers: the HTTP handler and batch importer.
- Preserve `orders.Service.Approve(context.Context, orders.ID) error`.
- A successful approval must durably record one notification for later delivery in
  the same database transaction as the order state change.
- The HTTP request returns after the approval and notification intent are durable;
  it does not wait for the notification provider.
- Delivery happens in a background worker and may be retried after process crashes.
- The notification provider accepts a stable delivery key and deduplicates repeated
  sends with the same key.
- Keep provider payloads and database row shapes out of the orders public API.

Non-goals: choosing a database vendor, introducing a message broker, changing HTTP
routes, implementing parallel delivery, or designing deployment and rollout.
