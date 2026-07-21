### Visual parity

**You own pixel-exact equivalence. The baseline is the spec; you do not touch it.** For "make X match Y exactly", styling-system migrations, porting a UI across frameworks. Equivalence is verified by image diff, not by eye.

1. Establish the baseline first, before any migration: a visual regression harness that screenshots the current component across its states, plus the target when matching two implementations. No baseline, no parity claim. A blocking prerequisite, not a follow-up.
2. Anti-shortcut clauses, stated and held: no harness modifications, no baseline tampering, no component restructuring to make a diff pass. If the baseline looks wrong, stop and ask, don't edit it.
3. Migrate one component at a time. Each is an independent artifact, so
   parallelize only when the host can give each owner isolated writable state;
   otherwise run the components sequentially (Use skill
   `principle-separate-before-serializing-shared-state`). Shared primitives
   migrate first as a blocking phase.
4. Verify each component against its baseline via image diff on the matching surface with the host's available browser, UI-control, or screenshot capability. A nonzero diff is a fail; investigate the pixel delta, don't wave it through. Invoke the available `loop` capability as a skill, command, CLI, or host primitive for each component until the diff is zero; without a loop provider, execute the same verify-and-correct cycle directly.
5. Run **Opening a PR** per component or per safe batch.

**Reply:** components migrated, the diff result for each, the baseline harness location, what's left.
