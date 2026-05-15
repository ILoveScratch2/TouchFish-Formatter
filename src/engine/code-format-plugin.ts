import type { Root, Code } from "mdast";
import { visit } from "unist-util-visit";
import type { ClangFormatConfig } from "../types";
import { formatCode } from "./clang-format";


export async function runClangFormat(tree: Root, config: ClangFormatConfig): Promise<void> {
  if (!config.enabled) return;

  const codeNodes: Code[] = [];
  visit(tree, "code", (node) => {
    const lang = (node as Code).lang ?? "";
    if (lang === "cpp" || lang === "c" || lang === "c++" || lang === "cc") {
      codeNodes.push(node as Code);
    }
  });

  for (const node of codeNodes) {
    node.value = await formatCode(node.value, config);
  }
}
