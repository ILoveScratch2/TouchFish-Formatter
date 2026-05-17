import { MATH_RULES } from "./rules";

export function formatMathNode(
  value: string,
  enabledRules: Record<string, boolean>,
  normalizeMathSpaces = true,
): string {
  let result = value.trim();

  for (const rule of MATH_RULES) {
    if (!enabledRules[rule.id]) continue;
    result = result.replace(rule.pattern, rule.replacement as string);
  }

  result = result.replace(/ +/g, " ");
  return normalizeMathSpaces ? result.trim() : result;
}
