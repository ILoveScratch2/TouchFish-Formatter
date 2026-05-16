import type { Root, Code } from "mdast";
import { visit } from "unist-util-visit";
import type { ClangFormatConfig } from "../types";
import { formatCode } from "./clang-format";

function parseLangs(config: ClangFormatConfig): Set<string> {
  const set = new Set<string>();
  if (config.customLanguages) {
    for (const lang of config.customLanguages.split(/[,;\s]+/)) {
      const t = lang.trim().toLowerCase();
      if (t) set.add(t);
    }
  }
  return set;
}

export async function runClangFormat(tree: Root, config: ClangFormatConfig): Promise<void> {
  if (!config.enabled) return;

  const langs = parseLangs(config);
  if (langs.size === 0) return;

  const nodes: Code[] = [];
  visit(tree, "code", (node) => {
    const lang = (node as Code).lang ?? "";
    if (langs.has(lang.toLowerCase())) {
      nodes.push(node as Code);
    }
  });

  for (const node of nodes) {
    node.value = await formatCode(node.value, config);
  }
}
