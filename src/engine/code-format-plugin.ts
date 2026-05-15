import type { Root, Code } from "mdast";
import { visit } from "unist-util-visit";
import type { ClangFormatConfig } from "../types";
import { formatCode } from "./clang-format";

const BUILTIN_LANGS = new Set([
  "c", "cc", "cpp", "c++", "cxx",
  "h", "hh", "hpp", "h++", "hxx",
  "inc", "inl",
]);

function resolveLangs(config: ClangFormatConfig): Set<string> {
  const set = new Set(BUILTIN_LANGS);
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

  const langs = resolveLangs(config);

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
