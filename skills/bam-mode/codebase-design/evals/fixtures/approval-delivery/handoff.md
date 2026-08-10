# Handoff

Locked: follow `spec.md`; the existing approval callers and `Service.Approve`
signature remain compatible.

Open: package ownership, the atomic persistence boundary, and the worker-facing
delivery contract require codebase design.

Skip:
- entity-model-design: yes - the order state and notification intent are approved.
- codebase-design: no - transaction, dependency, retry, and ownership boundaries need approval.
- plan thickness: none - this request ends at the architecture design.
