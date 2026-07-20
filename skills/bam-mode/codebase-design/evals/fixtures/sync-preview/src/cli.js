import { syncSessions } from "./sync.js";

export async function run(argv, { readFile, client, stdout }) {
  const [inputPath] = argv;
  if (!inputPath) throw new Error("usage: sync-sessions <input.json>");
  const records = JSON.parse(await readFile(inputPath, "utf8"));
  const count = await syncSessions(records, client);
  stdout(`synced ${count}`);
}
