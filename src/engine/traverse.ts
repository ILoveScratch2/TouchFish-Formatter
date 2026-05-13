import type { Node, Parent, Literal } from "unist";

export function isText(node: Node): node is TextNode {
  return node.type === "text";
}

export function isInlineCode(node: Node): node is InlineCodeNode {
  return node.type === "inlineCode";
}

export function isInlineMath(node: Node): node is InlineMathNode {
  return node.type === "inlineMath";
}

export function isMath(node: Node): node is MathNode {
  return node.type === "math";
}

function isTextDirective(node: Node): boolean {
  return node.type === "textDirective";
}

export function isLeaf(node: Node): boolean {
  return (
    isText(node) ||
    isInlineCode(node) ||
    isInlineMath(node) ||
    isMath(node) ||
    node.type === "html" ||
    node.type === "yaml" ||
    node.type === "break" ||
    node.type === "thematicBreak" ||
    node.type === "image" ||
    node.type === "imageReference" ||
    node.type === "definition" ||
    node.type === "footnoteDefinition" ||
    node.type === "footnoteReference" ||
    node.type === "leafDirective"
  );
}

export function hasChildren(node: Node): node is Parent {
  return "children" in node && Array.isArray((node as Parent).children);
}


export interface TextNode extends Literal {
  type: "text";
  value: string;
}

export interface InlineCodeNode extends Literal {
  type: "inlineCode";
  value: string;
}

export interface InlineMathNode extends Literal {
  type: "inlineMath";
  value: string;
}

export interface MathNode extends Literal {
  type: "math";
  value: string;
}

export function lastLeaf(child: Node): Node {
  if (isLeaf(child)) return child;
  if (hasChildren(child) && child.children.length > 0) {
    return lastLeaf(child.children[child.children.length - 1]);
  }
  return child;
}

export function firstLeaf(child: Node): Node {
  if (isLeaf(child)) return child;
  if (hasChildren(child) && child.children.length > 0) {
    return firstLeaf(child.children[0]);
  }
  return child;
}

export function mergeAdjacentTextDirective(nodes: Node[]): Node[] {
  if (nodes.length < 2) return nodes;

  const merged: Node[] = [];
  let buf = "";

  function flushBuf() {
    if (buf.length > 0) {
      merged.push({ type: "text", value: buf } as Node);
      buf = "";
    }
  }

  for (const node of nodes) {
    if (node.type === "text") {
      buf += (node as TextNode).value;
    } else if (isTextDirective(node)) {
      buf += ":" + (node as unknown as { name: string }).name;
    } else {
      flushBuf();
      merged.push(node);
    }
  }
  flushBuf();

  return merged;
}
