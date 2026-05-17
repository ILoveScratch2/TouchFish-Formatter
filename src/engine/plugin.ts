import type { Plugin } from "unified";
import type { Root } from "mdast";
import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";
import { FormatConfig } from "../types";
import {
  isText,
  isInlineMath,
  isInlineCode,
  isMath,
  isLeaf,
  hasChildren,
  firstLeaf,
  lastLeaf,
  mergeAdjacentTextDirective,
  type TextNode,
} from "./traverse";
import { analyzeTextBoundary, gapAfterText } from "./spacing";
import { formatTextNode } from "./text-format";
import { formatMathNode } from "./math-format";

const BLOCK_WRAPPERS = new Set(["blockquote", "list", "table", "tableRow", "containerDirective"]);

const INLINE_WRAPPERS = new Set([
  "delete", "emphasis", "heading", "link", "linkReference",
  "listItem", "paragraph", "strong", "tableCell",
]);

const SKIP = new Set(["root", "text", "inlineMath", "math", "inlineCode"]);

function formatLeaf(node: Node, config: FormatConfig): void {
  if (node.type === "text") {
    (node as TextNode).value = formatTextNode(
      (node as TextNode).value,
      config.fwPunctuation,
      config.ellipsisToFw,
    );
  } else if (node.type === "inlineMath" || node.type === "math") {
    (node as unknown as { value: string }).value = formatMathNode(
      (node as unknown as { value: string }).value,
      config.mathRules,
      config.normalizeMathSpaces,
    );
  }
}

function spaceInlineChildren(children: Node[], config: FormatConfig): void {
  let pendingGap = false;

  for (const ch of children) {
    walkNode(ch as Node, config);
  }

  for (let i = 1; i < children.length; i++) {
    const prevTip = lastLeaf(children[i - 1] as Node);
    const nextTip = firstLeaf(children[i] as Node);

    if (isText(prevTip) && isText(nextTip)) {
      const decision = analyzeTextBoundary(
        (prevTip as TextNode).value,
        (nextTip as TextNode).value,
        pendingGap,
      );
      (prevTip as TextNode).value = decision.adjustedLeft;
      (nextTip as TextNode).value = decision.adjustedRight;
      pendingGap = decision.carryTrim;
      if (decision.separator) {
        children.splice(i, 0, { type: "text", value: " " } as Node);
        i++;
      }
      continue;
    }

    if (isText(prevTip)) {
      const raw = (prevTip as TextNode).value;
      const core = raw.trimEnd();
      const gap = raw.length !== core.length;
      const neighbor = core.length > 0 ? core[core.length - 1] : "";
      (prevTip as TextNode).value = gapAfterText(neighbor, "A", gap) ? core + " " : core;
      continue;
    }

    if (isText(nextTip)) {
      const raw = (nextTip as TextNode).value;
      const core = raw.trimStart();
      const gap = raw.length !== core.length;
      const neighbor = core.length > 0 ? core[0] : "";
      (nextTip as TextNode).value = gapAfterText("A", neighbor, gap) ? " " + core : core;
      continue;
    }

    pendingGap = false;
  }
}

function walkNode(node: Node, config: FormatConfig): void {
  if (isLeaf(node)) {
    formatLeaf(node, config);
    return;
  }

  if (!hasChildren(node) || SKIP.has(node.type)) return;

  const kids = node.children as Node[];

  if (BLOCK_WRAPPERS.has(node.type)) {
    for (const child of kids) {
      walkNode(child as Node, config);
    }
    return;
  }

  if (INLINE_WRAPPERS.has(node.type)) {
    spaceInlineChildren(kids, config);
    return;
  }
  for (const child of kids) {
    walkNode(child as Node, config);
  }
}

const PREPROCESS_TARGETS = [
  "delete", "emphasis", "heading", "link", "linkReference",
  "listItem", "paragraph", "strong", "tableCell",
];

function preprocessTree(tree: Node): void {
  visit(tree, PREPROCESS_TARGETS, (node) => {
    if (!hasChildren(node)) return;
    node.children = mergeAdjacentTextDirective(node.children as Node[]) as unknown as typeof node.children;
  });
}

export function applyFormatter(tree: Root, options: FormatConfig): void {
  preprocessTree(tree);
  for (const child of tree.children) {
    walkNode(child as Node, options);
  }
}

export function remarkLfmFmt(options: FormatConfig): Plugin<[FormatConfig], Root> {
  return () => (tree: Root) => {
    applyFormatter(tree, options);
  };
}
