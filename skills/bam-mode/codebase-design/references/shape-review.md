# Architecture shape review

Use this only to review a non-obvious new Definition Mode shape. Revise the
design when one of these problems is material; the design artifact reports the
resulting decision, not rubric compliance.

## Shallow boundary

The public surface exposes nearly as much coordination or policy as the module
hides. Callers must sequence several methods, select internal stages, or learn
implementation rules to complete one capability. Concentrate the capability
behind a smaller semantic contract.

## Information leakage

Several modules depend on the same private representation, provider protocol,
storage schema, or policy decision. Keep boundary representations private and
translate them to the concepts owned by the receiving module.

Share domain data and policy, not caller-specific presentation or transport
projection. Formatting and wire mapping stay at the caller edge unless they are
the shared domain capability itself.

## Temporal decomposition

Modules are organized as execution stages such as load, validate, transform,
and save even though they share one body of domain knowledge. Group by owned
knowledge and invariants; execution order belongs in interaction flow.

## Pass-through boundary

A layer forwards the same arguments and result without adding policy,
translation, ownership, or isolation. Remove it or move the complete capability
to the boundary that can own it.

## Policy displacement

An adapter or infrastructure implementation must inspect domain state, infer a
transition, or invent an effect because its interface is too generic. Keep the
representation hidden, but name the semantic operation or pass an explicit
domain intent so infrastructure only executes the required effect. For a domain
effect consumed later, the owner supplies the intent's stable identity and
semantic fields; the adapter may translate and persist them but not derive them.
