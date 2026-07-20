export function createClient(transport) {
  return {
    apply(operation, id) {
      return transport.post("/sessions/sync", { operation, id });
    }
  };
}
