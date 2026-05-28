import { execSync, spawnSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RENDER_JS = path.join(__dirname, "render.js");

// Fixtures for each diagram family
const fixtures = [
  {
    name: "flowchart",
    code: `flowchart TD
    A[StartLabel] --> B(ProcessLabel)
    B --> C{DecisionLabel}
`,
    formats: ["unicode", "ascii", "svg"],
    labels: ["StartLabel", "ProcessLabel", "DecisionLabel"],
  },
  {
    name: "sequence",
    code: `sequenceDiagram
    AliceLabel->>BobLabel: Hello Bob, how are you?
    BobLabel-->>AliceLabel: Jolly good!
`,
    formats: ["unicode", "ascii", "svg"],
    labels: ["AliceLabel", "BobLabel"],
  },
  {
    name: "class",
    code: `classDiagram
    AnimalLabel <|-- DuckLabel
    AnimalLabel : +int age
`,
    formats: ["unicode", "ascii", "svg"],
    labels: ["AnimalLabel", "DuckLabel"],
  },
  {
    name: "state",
    code: `stateDiagram-v2
    [*] --> StillLabel
    StillLabel --> [*]
`,
    formats: ["unicode", "ascii", "svg"],
    labels: ["StillLabel"],
  },
  {
    name: "ER",
    code: `erDiagram
    CUSTOMER_LABEL ||--o{ ORDER_LABEL : places
`,
    formats: ["unicode", "ascii", "svg"],
    labels: ["CUSTOMER_LABEL", "ORDER_LABEL"],
  },
  {
    name: "XY chart",
    code: `xychart-beta
    title "SalesLabel"
    x-axis [jan, feb]
    y-axis "RevenueLabel" 0 --> 100
    bar [10, 30]
`,
    formats: ["unicode", "ascii", "svg"],
    labels: ["SalesLabel"],
    svgLabels: ["RevenueLabel"],
  },
];

let failed = false;

function runRenderer(args, options = {}) {
  return spawnSync("node", [RENDER_JS, ...args], {
    encoding: "utf8",
    ...options,
  });
}

console.log("=== Running Mermaid Renderer Smoke Tests ===");

// 1. Run all fixtures
for (const fx of fixtures) {
  for (const format of fx.formats) {
    console.log(`Testing ${fx.name} diagram [format: ${format}]...`);
    const res = runRenderer(["-f", format], { input: fx.code });

    if (res.status !== 0) {
      console.error(`❌ ${fx.name} (${format}) failed with exit code ${res.status}`);
      console.error(res.stderr);
      failed = true;
      continue;
    }

    const output = res.stdout;
    if (!output || output.trim() === "") {
      console.error(`❌ ${fx.name} (${format}) produced empty output`);
      failed = true;
      continue;
    }

    if (format === "svg") {
      if (!output.trim().startsWith("<svg")) {
        console.error(`❌ ${fx.name} (svg) did not start with <svg`);
        failed = true;
      }
    }

    const expectedLabels = [...fx.labels];
    if (format === "svg" && fx.svgLabels) {
      expectedLabels.push(...fx.svgLabels);
    }

    for (const label of expectedLabels) {
      if (!output.includes(label)) {
        console.error(`❌ ${fx.name} (${format}) output is missing label: ${label}`);
        console.error("Output was:\n", output);
        failed = true;
      }
    }
  }
}

// 2. Validate config checks (environment variable validations)
const envValidationTests = [
  {
    env: { MERMAID_PADDING: "-10" },
    expectedError: "Preference 'padding' must be a finite non-negative number",
  },
  {
    env: { MERMAID_COLOR_MODE: "invalid_mode" },
    expectedError: "Preference 'colorMode' must be one of",
  },
];

console.log("\n=== Testing Config Validation via Env Overrides ===");
for (const test of envValidationTests) {
  if (test.env) {
    const key = Object.keys(test.env)[0];
    const val = test.env[key];
    console.log(`Testing invalid env variable: ${key}=${val}...`);
    const res = runRenderer(["-f", "unicode"], {
      input: "graph TD; A --> B;",
      env: { ...process.env, ...test.env },
    });

    if (res.status === 0) {
      console.error(`❌ Invalid env override ${key}=${val} was not rejected!`);
      failed = true;
    } else {
      if (!res.stderr.includes(test.expectedError)) {
        console.error(`❌ Unexpected error message for ${key}=${val}. Expected to include: "${test.expectedError}"`);
        console.error("Stderr was:\n", res.stderr);
        failed = true;
      } else {
        console.log(`✅ Correctly rejected: ${res.stderr.trim()}`);
      }
    }
  }
}

// 3. Validate config checks via local config (preferences.json)
console.log("\n=== Testing Config Validation and Warning via Local preferences.json ===");
const tempConfigPath = path.join(process.cwd(), "preferences.json");
try {
  // Test 3a: Valid local config warning
  console.log("Testing warning message when loading local preferences.json...");
  writeFileSync(tempConfigPath, JSON.stringify({ padding: 10 }), "utf8");
  const resValid = runRenderer(["-f", "unicode"], {
    input: "graph TD; A --> B;",
  });
  
  if (resValid.status !== 0) {
    console.error("❌ Valid local config caused failure:", resValid.stderr);
    failed = true;
  } else {
    const expectedWarning = "Reading local preferences from generic 'preferences.json' is deprecated and may collide with other tools";
    if (!resValid.stderr.includes(expectedWarning)) {
      console.error("❌ Deprecation warning was not printed in stderr when loading preferences.json!");
      console.error("Stderr was:\n", resValid.stderr);
      failed = true;
    } else {
      console.log("✅ Warning printed successfully.");
    }
  }

  // Test 3b: Invalid local config rejection
  console.log("Testing invalid property in local preferences.json...");
  writeFileSync(tempConfigPath, JSON.stringify({ padding: -5 }), "utf8");
  const resInvalid = runRenderer(["-f", "unicode"], {
    input: "graph TD; A --> B;",
  });

  if (resInvalid.status === 0) {
    console.error("❌ Invalid local preferences.json was not rejected!");
    failed = true;
  } else {
    const expectedError = "Preference 'padding' must be a finite non-negative number";
    if (!resInvalid.stderr.includes(expectedError)) {
      console.error(`❌ Unexpected error message. Expected: "${expectedError}"`);
      console.error("Stderr was:\n", resInvalid.stderr);
      failed = true;
    } else {
      console.log(`✅ Correctly rejected invalid local config: ${resInvalid.stderr.trim()}`);
    }
  }
} finally {
  try {
    unlinkSync(tempConfigPath);
  } catch (err) {
    // Ignore if not exists
  }
}

if (failed) {
  console.error("\n❌ Some tests FAILED.");
  process.exit(1);
} else {
  console.log("\n✅ All smoke tests passed successfully!");
  process.exit(0);
}
