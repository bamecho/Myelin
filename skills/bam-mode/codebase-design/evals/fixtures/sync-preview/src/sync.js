export async function syncSessions(records, client) {
  let count = 0;
  for (const record of records) {
    if (!record.active) continue;
    await client.apply(record.operation, record.id);
    count += 1;
  }
  return count;
}
