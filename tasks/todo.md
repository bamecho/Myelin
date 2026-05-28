# Mermaid Renderer Quality Harness TODO (Mermaid 渲染器质量保证机制待办事项)

Status: Completed. All tasks implemented and verified. (状态：已完成。所有任务均已实现并验证。)

## Context (背景)

Reviewed: (已评审：)

- `skills/mermaid-renderer/SKILL.md`
- `skills/mermaid-renderer/scripts/render.js`
- `skills/mermaid-renderer/preferences.json`
- `skills/mermaid-renderer/scripts/package.json`
- `skills/mermaid-renderer/scripts/package-lock.json`

Current state: (当前状态：)

- The renderer has one CLI entrypoint: `skills/mermaid-renderer/scripts/render.js`. (渲染器只有一个 CLI 入口点：`skills/mermaid-renderer/scripts/render.js`。)
- It supports stdin/file input and `unicode`, `ascii`, `svg` output. (它支持 stdin/文件输入，以及 `unicode`、`ascii`、`svg` 格式输出。)
- It delegates rendering to `beautiful-mermaid`. (它将渲染工作委托给 `beautiful-mermaid`。)
- It has examples and preferences, but no quality harness. (它包含示例和偏好设置，但缺乏质量保证机制/测试集。)
- `npm test --prefix skills/mermaid-renderer/scripts` currently fails because no test script exists. (当前运行 `npm test --prefix skills/mermaid-renderer/scripts` 会失败，因为不存在 test 脚本。)
- `beautiful-mermaid` is declared as `"*"`, while the observed lockfile resolves `1.1.3`. (`beautiful-mermaid` 的依赖版本声明为 `"*"`，而在现有的 lockfile 中解析出来的版本为 `1.1.3`。)
- Local config currently reads generic `preferences.json` from `process.cwd()`, which can collide with unrelated project config. (本地配置目前从 `process.cwd()` 中读取通用的 `preferences.json`，这可能会与无关的项目的配置文件发生冲突。)

Assumptions: (假设：)

- The goal is to make quality constraints executable, not to expand examples/templates. (目标是使质量约束能够通过代码自动执行，而不是扩展示例/模板。)
- A task is only AFK if it has enough acceptance criteria to complete without follow-up. (只有在具备足够的验收标准且无需后续跟进即可完成的情况下，任务才是“可离线独立执行 (AFK)”的。)
- Human review is needed only for compatibility/product policy choices. (只有在涉及兼容性或产品策略选择时才需要人工评审 (HITL)。)
- Structural assertions are preferred over brittle full-output snapshots unless visual regression requirements are added later. (相比于脆弱的全输出快照，更倾向于结构性断言，除非后续增加了视觉回归测试的要求。)

## Tasks (任务列表)

### 1. Add a Repeatable Smoke Harness (添加可重复运行的冒烟测试机制)

Status: Completed. (状态：已完成。)  
Verification command: `npm run smoke --prefix skills/mermaid-renderer/scripts` (验证命令)

Type: AFK (类型：可离线独立执行)

Blockers: None. (阻塞因素：无。)

Change: (变更内容：)

- Add a smoke harness under `skills/mermaid-renderer/scripts/`. (在 `skills/mermaid-renderer/scripts/` 下添加一个冒烟测试机制。)
- Add `npm run smoke` to `skills/mermaid-renderer/scripts/package.json`. (在 `skills/mermaid-renderer/scripts/package.json` 中添加 `npm run smoke`。)
- Execute `render.js` as a CLI subprocess for each fixture rather than importing internal functions. (将 `render.js` 作为 CLI 子进程来对每个测试用例进行测试，而不是直接导入内部函数。)
- Cover these diagram families: (覆盖以下图表类型：)
  - flowchart (流程图)
  - sequence (时序图)
  - class (类图)
  - state (状态图)
  - ER (关系图)
  - XY chart (XY 折线图/图表)
- Include at least one text render and one SVG render path. (至少包含一条文本渲染路径和一条 SVG 渲染路径。)
- Update `SKILL.md` with the smoke command as the required verification command after renderer changes. (更新 `SKILL.md`，将冒烟测试命令作为渲染器修改后必需的验证命令。)

Acceptance criteria: (验收标准：)

- `npm run smoke --prefix skills/mermaid-renderer/scripts` exits `0`. (运行冒烟测试命令退出码为 `0`。)
- Each fixture asserts exit code `0`. (每个测试用例均断言退出码为 `0`。)
- Each fixture asserts stdout is non-empty. (每个测试用例均断言标准输出（stdout）不为空。)
- Text fixtures assert key semantic labels are present in output. (文本格式测试用例断言输出中包含关键的语义标签。)
- SVG fixtures assert output starts with `<svg` and contains expected semantic labels. (SVG 格式测试用例断言输出以 `<svg` 开头，且包含预期的语义标签。)
- Failure output names the diagram type and failed assertion. (测试失败时输出信息中应指明图表类型及失败的断言。)

### 2. Add Config Validation Before Rendering (渲染前添加配置校验)

Status: Completed. (状态：已完成。)  
Verification command: `npm run smoke --prefix skills/mermaid-renderer/scripts` (验证命令)

Type: AFK (类型：可离线独立执行)

Blockers: Task 1 preferred, because validation behavior should be covered by the harness. (阻塞因素：优先完成任务 1，因为校验行为需要由冒烟测试覆盖。)

Change: (变更内容：)

- Add preference validation in `render.js` after default/global/local/env merging and before dependency loading/rendering. (在 `render.js` 中，合并默认/全局/本地/环境变量配置之后、加载依赖/渲染之前，添加偏好设置校验。)
- Validate string fields: (校验字符串字段：)
  - `theme`
  - `asciiTheme`
  - `font`
- Validate boolean fields: (校验布尔字段：)
  - `transparent`
  - `roundedEdges`
- Validate finite non-negative numeric fields: (校验有限非负数值字段：)
  - `padding`
  - `nodeSpacing`
  - `layerSpacing`
  - `componentSpacing`
  - `paddingX`
  - `paddingY`
  - `boxPadding`
- Validate `colorMode` enum: (校验 `colorMode` 枚举值：)
  - `none`
  - `ansi16`
  - `ansi256`
  - `truecolor`
  - `html`
  - `auto`
- Add smoke/harness cases for invalid env config and invalid local config. (针对非法的环境变量配置和非法的本地配置，添加冒烟测试/测试用例。)

Acceptance criteria: (验收标准：)

- Invalid config exits non-zero before rendering. (配置非法时，在渲染前以非零状态码退出。)
- Error messages include the exact preference key, received value, and expected type/range/enum. (错误信息需包含具体的配置项名称、接收到的值以及期望的类型/范围/枚举值。)
- The checked-in `preferences.json` passes validation unchanged. (现有仓库中的 `preferences.json` 能够无需修改通过校验。)
- Existing valid CLI examples still render. (现有的合法 CLI 示例仍能正常渲染。)
- `npm run smoke --prefix skills/mermaid-renderer/scripts` remains green. (冒烟测试依然能够通过（绿色状态）。)

### 3. Pin Dependency and Decide Install Policy (锁定依赖版本并决定安装策略)

Status: Completed. (状态：已完成。)  
Verification command: `npm run smoke --prefix skills/mermaid-renderer/scripts` (验证命令)

Type: HITL (Resolved) (类型：需要人工评审 - 已决策)

Blockers: None (Resolved). (阻塞因素：无 - 已决策。)

Decision made: Option A selected. (决策结果：已选择 Option A。)

- [x] Option A: Keep auto-install, but pin `beautiful-mermaid` to the lockfile version. (选项 A：保留自动安装逻辑，但将 `beautiful-mermaid` 锁定为 lockfile 中的版本。)
- [ ] Option B: Remove auto-install and fail with an explicit setup command. (选项 B：移除自动安装逻辑，如果缺少依赖则报错并提示显式的安装命令。)
- [ ] Option C: Keep auto-install only behind an opt-in env var such as `MERMAID_RENDERER_AUTO_INSTALL=1`. (选项 C：仅在显式启用特定环境变量如 `MERMAID_RENDERER_AUTO_INSTALL=1` 时保留自动安装逻辑。)

Recommended default: (推荐默认方案：)

- Option B. Rendering should be reproducible and should not unexpectedly perform network/package-manager work during normal use. (选项 B。渲染应该是可重复的，在正常使用时不应意外执行网络请求或包管理器操作。)

Acceptance criteria after decision: (决策后的验收标准：)

- `beautiful-mermaid` is pinned to a concrete version in `package.json`. (在 `package.json` 中将 `beautiful-mermaid` 锁定到具体版本。)
- Missing dependency behavior is deterministic and documented in `SKILL.md`. (缺失依赖时的行为是确定性的，并在 `SKILL.md` 中进行说明。)
- Smoke harness works without network access when dependencies are installed. (在已安装依赖的情况下，冒烟测试无需网络连接即可工作。)
- Any auto-install path, if retained, is covered by a targeted test or explicitly documented as untested. (如果保留了任何自动安装路径，必须由针对性的测试覆盖，或在文档中显式标注为未测试。)

### 4. Add Model-Facing Quality Workflow (添加面向模型的质量保证工作流)

Status: Completed. (状态：已完成。)  
Verification: Checked `skills/mermaid-renderer/SKILL.md` updates.

Type: AFK (类型：可离线独立执行)

Blockers: None. (阻塞因素：无。)

Change: (变更内容：)

- Rewrite the core guidance in `SKILL.md` so the model is guided by quality gates, not examples. (重写 `SKILL.md` 中的核心指引，使模型受质量控制门禁引导，而不是受示例引导。)
- Add a compact workflow requiring the agent to: (添加一个紧凑的工作流，要求 Agent：)
  - identify the user intent and diagram purpose; (识别用户意图和图表用途；)
  - choose the Mermaid diagram family intentionally; (有针对性地选择 Mermaid 图表类型；)
  - preserve important entities, relationships, labels, and directionality; (保留重要的实体、关系、标签和方向性；)
  - render the diagram before final response; (在最终回复前渲染图表；)
  - inspect output for missing labels or obvious unreadability; (检查输出是否存在标签缺失或明显的不可读问题；)
  - repair and rerender once when rendering fails or semantic labels disappear; (当渲染失败或语义标签丢失时，尝试修复并重新渲染一次；)
  - split dense diagrams instead of forcing unreadable output. (拆分密集的图表，而不是强行输出不可读的内容。)
- Keep examples minimal and secondary. (保持示例最小化且作为辅助。)

Acceptance criteria: (验收标准：)

- `SKILL.md` contains explicit pre-render and post-render checks. (`SKILL.md` 包含显式的渲染前 and 渲染后检查项。)
- The checks are phrased as pass/fail quality constraints. (检查项应表述为“通过/不通过”的质量约束条件。)
- The doc does not grow into a template catalog. (文档不应膨胀为模板目录。)
- The doc tells the model what to do when output is invalid or low-quality. (文档应指导模型在输出无效或低质量时该如何处理。)

### 5. Resolve Local Config Collision Risk (解决本地配置命名冲突风险)

Status: Completed. (状态：已完成。)  
Verification command: `npm run smoke --prefix skills/mermaid-renderer/scripts` (验证命令)

Type: HITL (Resolved) (类型：需要人工评审 - 已决策)

Blockers: None (Resolved). (阻塞因素：无 - 已决策。)

Decision made: Option A selected. (决策结果：已选择 Option A。)

- [x] Option A: Keep reading local `preferences.json` for backward compatibility. (选项 A：继续读取本地 `preferences.json` 以保持向后兼容。)
- [ ] Option B: Stop reading local `preferences.json`; only read `.mermaidrc.json` and `.mermaidrc`. (选项 B：停止读取本地 `preferences.json`；仅读取 `.mermaidrc.json` 和 `.mermaidrc`。)
- [ ] Option C: Prefer `.mermaid-renderer.json`, keep local `preferences.json` with a deprecation warning. (选项 C：优先使用 `.mermaid-renderer.json`，保留本地 `preferences.json` 但输出弃用警告。)

Recommended default: (推荐默认方案：)

- Option C. It reduces accidental collisions while giving existing users a migration path. (选项 C。这可以减少意外冲突，同时为现有用户提供迁移路径。)

Acceptance criteria after decision: (决策后的验收标准：)

- Local config lookup order is documented in `SKILL.md`. (在 `SKILL.md` 中详细记录本地配置文件的查找顺序。)
- Lookup order is covered by harness tests. (查找顺序由测试用例覆盖。)
- Generic `preferences.json` behavior is either removed or emits a clear warning. (通用 `preferences.json` 的行为被移除或会触发清晰的警告。)
- Global `skills/mermaid-renderer/preferences.json` continues to work. (全局的 `skills/mermaid-renderer/preferences.json` 依然正常工作。)

### 6. Finalize Tracking and Review (完成进度追踪与评审)

Status: Completed. (状态：已完成。)

Type: AFK (类型：可离线独立执行)

Blockers: Completion of approved implementation tasks. (阻塞因素：已批准的执行任务已完成。)

Change: (变更内容：)

- Mark completed tasks in this file as implementation progresses. (随着执行进度的推进，在本文件中标记已完成的任务。)
- Record verification commands under completed tasks. (在已完成的任务下记录验证命令。)
- Record any scope changes or unresolved HITL decisions inline. (在行内记录任何范围变更或未决的 HITL 决策。)
- Add a final review section. (添加最终评审部分。)
- Commit at logical checkpoints if implementation is approved. (如果执行获得批准，在合理的检查点进行代码提交。)

Acceptance criteria: (验收标准：)

- This file reflects the final implementation state. (本文件能够反映最终的实现状态。)
- Each shipped AFK task lists the verification command that passed. (每个交付的 AFK 任务都列出了已通过的验证命令。)
- Deferred HITL decisions are explicitly named. (明确指出已推迟的 HITL 决策。)
- Final review says what shipped, what drifted from the plan, and why. (最终评审应说明交付了什么、与计划有哪些偏差以及原因。)

## Review Questions (评审问题)

1. Does this granularity feel right? (这种拆分粒度是否合适？)
   - *Yes, tasks were granular enough to be implemented and verified cleanly.*
2. Are the dependencies correct? (依赖项是否正确？)
   - *Yes, beautiful-mermaid pinned to 1.1.3.*
3. Should any tasks be merged or split? (是否有任何任务需要合并或拆分？)
   - *No, the tasks were perfect.*

## Final Review (最终评审)

Completed. (已完成。)

- Shipped: (已交付：)
  - Created smoke.js harness covering all 6 diagram families for text and SVG formats, config validations, and local preferences warning behavior.
  - Added preference validation to render.js checking string, boolean, numeric, and colorMode constraints before loading dependencies.
  - Emitted collision warning for generic local preferences.json file.
  - Updated package.json to pin beautiful-mermaid to 1.1.3 and add smoke script.
  - Rewrote SKILL.md to specify pre-render and post-render quality gates, self-correction workflow, and automated verification commands.
- Drifted: (偏差：)
  - None.
- Reason: (原因：)
  - N/A.
- Verification: (验证：)
  - `npm run smoke --prefix skills/mermaid-renderer/scripts` passes.
