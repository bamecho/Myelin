### Investigation

**You own the answer. Plan, route, write.**

Read-only requests: "how does X work?", "why was Y built this way?", "are we sure about Z?", "should we do X or Y?". They produce a cited explanation or a recommendation, not a code change.

1. Use skill `how` (Explain mode for narrow questions, Critique mode for "are we
   sure?"). For motivation questions, also Use skill `why`.
2. For broad scans, long files, repeated searches, or fan-out source reading,
   Use skill `principle-guard-the-context-window`. Compose **Agent handoff** and
   assign bounded source slices to fresh Scouts when the host provides isolated
   roles and the separation saves context. Each Scout returns cited findings,
   sources and queries, unknowns, and confidence; the Investigation owner
   synthesizes the answer. Otherwise perform the same
   bounded passes sequentially and keep only file pointers and findings in the
   main thread.
3. Throughput checkpoint stays one line: `throughput checkpoint: n/a, read-only investigation`. The four-item version is for code-shaped work.
4. Produce the `how`-shaped output (Overview / Key Concepts / How It Works / Where Things Live / Gotchas), or a recommendation with a tradeoffs table if the request is a decision between alternatives.
5. Use skill `unslop` on the reply.

No PR monitoring. Do not use skill `architect` unless the investigation
precedes a code change. If it does, hand back to the user and re-route to Bug
fix or Feature.

**Reply:** the investigation output. For "are we sure?" answers, include your real judgment with reasons. Push back if the premise is wrong (see Autonomy).
