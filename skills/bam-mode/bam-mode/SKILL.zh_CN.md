# Bam mode 中文版

本文件是中文阅读版，方便直接审阅和分析。执行事实源仍以 `SKILL.md` 为准。

`bam-mode` 是一套自足的 pstack 风格工程模式，并加入 Bam 偏好的文档和审阅车道。运行时不要依赖 `poteto-mode`。如果这里和 pstack 内容重复，这是有意复制。这个 skill 自己携带需要的规则。

## 不可妥协项

多步骤任务先开 todolist，第一项是完整阅读下面的 Principles section。这些原则决定路由。最终回复里要点名真正改变过决策的原则。

其他触发规则：

- 非平凡变更、架构决策、或“确定吗？” -> 用 `how`。
- 任何代码 -> 先说清数据形状。
- 代码跨函数边界 -> 用 `architect`。
- 有争议的设计 -> ship 前用 `interrogate`。
- 长周期、自主、多阶段，或用户稍后审阅的工作 -> 用 `show-me-your-work`。
- 大型或横向工作，没有更窄 playbook -> 用 `figure-it-out`。
- 有便宜本地测试路径的 bug -> 用 `tdd`。
- 读写 TypeScript -> 用 `typescript-best-practices`。
- 任何文字产物 -> 用 `unslop`。

playbook 内部派生 subagent 时，如果可用，使用 `subagent_type: "poteto-agent"`。如果不可用，用最接近的 agent，并把本 skill 的规则写进 prompt。

## Principles

某个 principle 适用时，先读对应 leaf skill。

**核心**

- `principle-laziness-protocol`。重构、评估 diff 大小、想加抽象时，倾向删除和最小可行改动。
- `principle-foundational-thinking`。写逻辑前，先定核心类型、数据结构和共享状态归属。
- `principle-redesign-from-first-principles`。新需求进入旧设计时，把它当成一开始就存在的基础条件。
- `principle-subtract-before-you-add`。新增结构前先删掉无用负担。
- `principle-minimize-reader-load`。减少不必要层级和隐藏状态。
- `principle-outcome-oriented-execution`。计划性重写要收敛到目标架构，不维护临时兼容状态。
- `principle-experience-first`。产品和 UX 取舍优先考虑用户价值，而不是实现方便。
- `principle-exhaust-the-design-space`。新颖 UI 或架构决策先比较候选方案。
- `principle-build-the-lever`。非平凡工作要构建能完成或证明它的工具、脚本、codemod 或检查。

**架构**

- `principle-boundary-discipline`。守卫放在系统边界，业务逻辑保持纯净。
- `principle-type-system-discipline`。让非法状态无法表达，在边界解析外部数据。
- `principle-make-operations-idempotent`。命令和循环在重试下应收敛。
- `principle-migrate-callers-then-delete-legacy-apis`。迁移调用方和删除旧 API 放在同一波。
- `principle-separate-before-serializing-shared-state`。先消除并发写，再考虑序列化。

**验证**

- `principle-prove-it-works`。用真实产物验证。
- `principle-fix-root-causes`。复现并追到根因。
- `principle-sequence-verifiable-units`。多步骤工作拆成每步都有检查的单元。

**委派**

- `principle-guard-the-context-window`。大量读取、重复扫描、扇出工作交给 subagent。
- `principle-never-block-on-the-human`。可逆工作直接推进，只把真实产品或偏好决策交给人。

**元规则**

- `principle-encode-lessons-in-structure`。重复纠正要变成检查、元数据、脚本或 skill 修改。

## Playbooks

先匹配下面的 playbook。打开本 skill 目录下对应文件，把步骤原样复制进 todolist，再加入任务特定 todo。跳过的步骤也留在列表里，并写 `skip: <reason>`。

- Investigation：只读问题。`playbooks/investigation.md`。
- Bug fix：复现、根因、修复、验证。`playbooks/bug-fix.md`。
- Perf issue：基于 baseline 的性能问题。`playbooks/perf-issue.md`。
- Hillclimb：围绕指标的持续改进循环。`playbooks/hillclimb.md`。
- Runtime forensics：诊断实时运行症状。`playbooks/runtime-forensics.md`。
- Trace forensics：诊断已捕获的 profiling artifact。`playbooks/trace-forensics.md`。
- Feature：从命名数据形状出发的新行为或行为变化。`playbooks/feature.md`。
- Refactoring：保持行为不变的结构调整。`playbooks/refactoring.md`。
- Prototype：用于决策的一次性草图。`playbooks/prototype.md`。
- Visual parity：像素级 UI 等价。`playbooks/visual-parity.md`。
- Authoring or modifying a skill：`playbooks/authoring-a-skill.md`。
- Eval：测试 skill、结构或 prompt 变更如何影响行为。`playbooks/eval.md`。
- Autonomous run：长任务跑到完成。`playbooks/autonomous-run.md`。
- Session pickup：接手已有工作。`playbooks/session-pickup.md`。
- Pause safely：安全暂停，方便恢复。`playbooks/pause-safely.md`。
- Multi-phase or multi-PR plan：`playbooks/multi-phase-plan.md`。中文审阅版见 `references/plan.zh_CN.md`；执行事实源是 `references/plan.md`。
- Opening a PR：其他 playbook 结束时调用。`playbooks/opening-a-pr.md`。

复制来的 playbook 会提到一些 Cursor 内置能力或其他 plugin 技能，例如 `create-skill`、`babysit`、`deslop`、`control-cli`、`control-ui`。只有当前环境提供它们时才使用。若环境没有，就保留步骤意图，说明缺少工具，并用最接近的本地验证或审阅门禁继续。

## Bam 文档车道

Bam 增加的是实现前的文档和审阅车道。当任务需求不清、架构风险、数据模型风险、跨模块范围或长时间自主执行存在时使用。

小任务保留匹配到的 playbook。只有任务可能漂移时，补一段目标、边界和 proof 说明。

中型和大型任务在实现前补充明确产物：

| 规模 | 基础执行 | Bam 增量 |
|---|---|---|
| 小任务 | 匹配到的 playbook、principles、验证要求 | 必要时补目标、边界、proof 说明 |
| 中型任务 | Feature、Refactoring、Prototype、Bug fix 或 Investigation playbook | 设计产物、架构或模型段落、经过审阅的 plan |
| 大型任务 | `figure-it-out`、`show-me-your-work`、Multi-phase 或 Autonomous playbook | 需求或设计文档、架构文档、必要时的数据模型审计、pstack 风格 plan、审阅门禁、决策日志 |

如果任务很小，而且 playbook 已经足够约束，不要额外加文档重量。

计划产物遵循 `references/plan.md`：小计划写成 `NN-slug.md`；三阶段以上写成目录，包含 `overview.md`、各阶段文件和 `testing.md`。`tasks/todo.md` 只在用户明确要求 todo queue 时使用，不是中大型计划的默认载体。

## 本地补充技能

本模式使用的所有依赖都必须在 `skills/bam-mode` 里。运行时不要引用 `.agents/skills`。

只在空缺处使用这些补充技能：

| 需求 | 补充技能 | 增加的门禁 |
|---|---|---|
| 实现前的协作式设计 | `brainstorming` | 任务化前先得到已批准设计产物 |
| 产品需求或 spec 边界 | `hai-prd` | PRD 专用产物门禁 |
| 高位方向判断 | `geju` | 在局部补丁前打开设计空间 |
| 落地压力测试 | `goudi` | 最小可行第一步和 stop rule |
| 对需求、字段、状态、模块、步骤做剃刀 | `hai-razor` | 在任务化前删除伪概念 |
| APoSD 风格架构审阅 | `hai-architecture` | 带证据的架构 critique 产物 |
| 实体和字段设计 | `entity-model-auditor` | 字段级 store / compute / remove 判断 |
| 文档和代码漂移审计 | `hai-audit-docs-against-code` | 文档和实现一致性检查 |

不要引入 `git-workflow-and-versioning`。复制来的长周期 playbooks 和 `show-me-your-work` 已覆盖所需执行纪律。

如果补充技能只是换一种报告格式，但没有新增决策门禁，就跳过。

## 路由顺序

1. 判断工作类型，选择 playbook。
2. 根据本 skill 的原则和复制来的 playbook 创建 todolist。
3. 判断是否需要 Bam 文档车道。
4. 只插入必要的补充门禁。
5. 实现或长跑前审阅产物。
6. 回到 playbook，用可验证单元执行。

## 审阅门禁

审阅是阶段边界，不是最后润色。

- 需求审阅检查目标、非目标、验收标准和未决决策。
- 架构审阅检查职责归属、依赖方向、数据模型，以及调用方以后不需要知道什么。
- 任务审阅检查另一个 agent 能否在没有隐藏上下文的情况下执行清单。
- 代码审阅使用 `interrogate`、`blast-radius`、`tdd` 和匹配的 playbook。
- 长跑审阅检查 `show-me-your-work` 证据，以及执行是否留在已审阅产物范围内。

不要把每次审阅都变成新文档。审阅只需要重到足以防止下一阶段漂移。

## 输出纪律

用户用中文工作时，用中文输出。

中型或大型任务交付时说明：

- 选了哪个 playbook。
- 插入了哪些 Bam 补充门禁。
- 产物路径或产物段落在哪里。
- 每个门禁的审阅状态。
- 下一步可执行动作是什么。

按 `unslop` 要求写回复。不要倾倒所有候选技能，只点名真正改变路线的少数技能。

## 完成标准

`bam-mode` 完成的条件有两个：匹配到的 playbook 已满足，Bam 增加的产物也通过了对应审阅门禁。只改了代码不够，尤其当本模式要求了需求、架构、数据模型或任务化产物时。
