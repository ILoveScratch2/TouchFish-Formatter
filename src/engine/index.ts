import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify";
import remarkDirective from "remark-directive";
import { applyFormatter } from "./plugin";
import { runClangFormat } from "./code-format-plugin";
import type { FormatConfig, ClangFormatConfig } from "../types";

const processor = unified()
  .use(remarkParse)
  .use(remarkMath, { singleDollarTextMath: true })
  .use(remarkGfm)
  .use(remarkDirective)
  .use(remarkStringify, { bullet: "-", rule: "-" });


export function formatSolution(source: string, config: FormatConfig): string {
  if (!source) return source;
  const tree = processor.parse(source);
  applyFormatter(tree, config);
  let out = processor.stringify(tree) as unknown as string;
  if (out.endsWith("\n")) out = out.slice(0, -1);
  if (config.removeDuplicateBlankLines) out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}


export async function formatSolutionAsync(
  source: string,
  config: FormatConfig,
  clangConfig: ClangFormatConfig,
): Promise<string> {
  if (!source) return source;
  const tree = processor.parse(source);
  applyFormatter(tree, config);
  await runClangFormat(tree, clangConfig);
  let out = processor.stringify(tree) as unknown as string;
  if (out.endsWith("\n")) out = out.slice(0, -1);
  if (config.removeDuplicateBlankLines) out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}

export { MATH_RULES, getDefaultMathRules } from "./rules";
export type { FormatConfig, ClangFormatConfig } from "../types";
