import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify";
import remarkDirective from "remark-directive";
import { applyFormatter } from "./plugin";
import type { FormatConfig } from "../types";

const processor = unified()
  .use(remarkParse)
  .use(remarkMath, { singleDollarTextMath: true })
  .use(remarkGfm)
  .use(remarkDirective)
  .use(remarkStringify, {
    bullet: "-",
    rule: "-",
  });


export function formatSolution(source: string, config: FormatConfig): string {
  if (!source) return source;

  const tree = processor.parse(source);
  applyFormatter(tree, config);
  const out = processor.stringify(tree) as unknown as string;

  if (out.endsWith("\n")) return out.slice(0, -1);
  return out;
}

export { MATH_RULES, getDefaultMathRules } from "./rules";
export type { FormatConfig } from "../types";
