import type { MathRule } from "../types";

export const MATH_RULES: MathRule[] = [
  {
    id: "sym/star-to-times",
    group: "sym",
    descriptionKey: "rule.sym/star-to-times",
    pattern: /\*/g,
    replacement: " \\times ",
    enabled: false,
  },
  {
    id: "sym/less-equal",
    group: "sym",
    descriptionKey: "rule.sym/less-equal",
    pattern: /<=/g,
    replacement: " \\le ",
    enabled: true,
  },
  {
    id: "sym/greater-equal",
    group: "sym",
    descriptionKey: "rule.sym/greater-equal",
    pattern: />=/g,
    replacement: " \\ge ",
    enabled: true,
  },
  {
    id: "sym/not-equal",
    group: "sym",
    descriptionKey: "rule.sym/not-equal",
    pattern: /!=/g,
    replacement: " \\neq ",
    enabled: true,
  },
  {
    id: "sym/double-equal-to-single",
    group: "sym",
    descriptionKey: "rule.sym/double-equal-to-single",
    pattern: /==/g,
    replacement: " = ",
    enabled: false,
  },
  {
    id: "sym/arrow-right-to",
    group: "sym",
    descriptionKey: "rule.sym/arrow-right-to",
    pattern: /-+>/g,
    replacement: " \\to ",
    enabled: true,
  },
  {
    id: "sym/arrow-left-gets",
    group: "sym",
    descriptionKey: "rule.sym/arrow-left-gets",
    pattern: /<-+/g,
    replacement: " \\gets ",
    enabled: true,
  },
  {
    id: "sym/double-arrow-implies",
    group: "sym",
    descriptionKey: "rule.sym/double-arrow-implies",
    pattern: /=+>/g,
    replacement: " \\Rightarrow ",
    enabled: true,
  },
  {
    id: "fn/gcd",
    group: "fn",
    descriptionKey: "rule.fn/gcd",
    pattern: /(?<![\\{a-zA-Z])gcd(?![a-zA-Z}])/g,
    replacement: " \\gcd ",
    enabled: true,
  },
  {
    id: "fn/min",
    group: "fn",
    descriptionKey: "rule.fn/min",
    pattern: /(?<![\\{a-zA-Z])min(?![a-zA-Z}])/g,
    replacement: " \\min ",
    enabled: true,
  },
  {
    id: "fn/max",
    group: "fn",
    descriptionKey: "rule.fn/max",
    pattern: /(?<![\\{a-zA-Z])max(?![a-zA-Z}])/g,
    replacement: " \\max ",
    enabled: true,
  },
  {
    id: "fn/log",
    group: "fn",
    descriptionKey: "rule.fn/log",
    pattern: /(?<![\\{a-zA-Z])log(?![a-zA-Z}])/g,
    replacement: " \\log ",
    enabled: true,
  },
  {
    id: "fn/lca",
    group: "fn",
    descriptionKey: "rule.fn/lca",
    pattern: /(?<!\\operatorname\{)LCA(?!\})/g,
    replacement: " \\operatorname{LCA}",
    enabled: true,
  },
  {
    id: "fn/lcm",
    group: "fn",
    descriptionKey: "rule.fn/lcm",
    pattern: /(?<!\\operatorname\{)lcm(?!\})/g,
    replacement: " \\operatorname{lcm}",
    enabled: true,
  },
  {
    id: "fn/mex",
    group: "fn",
    descriptionKey: "rule.fn/mex",
    pattern: /(?<!\\operatorname\{)MEX(?!\})/g,
    replacement: " \\operatorname{MEX}",
    enabled: true,
  },
  {
    id: "syn/array-to-subscript",
    group: "syn",
    descriptionKey: "rule.syn/array-to-subscript",
    pattern: /(?<!\\)(?<![a-zA-Z])([a-zA-Z]+)((?:\[[^\]]+\])+)/g,
    replacement: (_m: string, name: string, brackets: string) => {
      const indices = brackets
        .replace(/^\[|\]$/g, "")
        .split("][")
        .join(",");
      return `${name}_{${indices}}`;
    },
    enabled: false,
  },
];

export function getDefaultMathRules(): Record<string, boolean> {
  // Engine-side default: all rules are active (matches the original's default
  // when no `enabledRules.math` array is passed).
  const rules: Record<string, boolean> = {};
  for (const rule of MATH_RULES) {
    rules[rule.id] = true;
  }
  return rules;
}

export function getEnabledRules(ruleConfig: Record<string, boolean>): MathRule[] {
  return MATH_RULES.filter((r) => ruleConfig[r.id]);
}
