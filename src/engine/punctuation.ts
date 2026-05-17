export const CJK =
  "⺀-⻿⼀-⿟぀-ゟ゠-ヺー-ヿ㄀-ㄯ㈀-㋿㐀-䶿一-鿿豈-﫿";

const CJK_RE = new RegExp(`[${CJK}]`);
const FW_PUNCT_RE = /[，。【】「」『』［］（）《》！？“”、～；：]/;
const HW_PUNCT_RE = /[!\?.,:;]/;

const HW_TO_FW: Record<string, string> = {
  ",": "，",
  ":": "：",
  ";": "；",
  "!": "！",
  "?": "？",
  ".": "。",
};

export function isCjk(ch: string): boolean {
  return CJK_RE.test(ch);
}

export function isCjkPunct(ch: string): boolean {
  return FW_PUNCT_RE.test(ch);
}

export function isHwPunct(ch: string): boolean {
  return HW_PUNCT_RE.test(ch);
}

export function toFullWidth(ch: string): string {
  return HW_TO_FW[ch] ?? ch;
}

interface ReplaceRule {
  pattern: RegExp;
  replacement: string | ((match: string, ...args: string[]) => string);
}

function cjkRe(pattern: string, flags?: string): RegExp {
  return new RegExp(pattern.replace(/\{CJK\}/g, `[${CJK}]`), flags);
}

export const textPreprocess: ReplaceRule[] = [
  {
    pattern: cjkRe(`(${HW_PUNCT_RE.source})({CJK})`, "g"),
    replacement: "$1 $2",
  },
  {
    pattern: cjkRe(`({CJK}) +(${HW_PUNCT_RE.source})`, "g"),
    replacement: "$1$2",
  },
  {
    pattern: cjkRe(`({CJK}) +(${FW_PUNCT_RE.source})`, "g"),
    replacement: "$1$2",
  },
  {
    // Remove spaces around em-dashes between CJK characters (pangu inserts them)
    pattern: cjkRe(`({CJK}) +(—+) +({CJK})`, "g"),
    replacement: "$1$2$3",
  },
  {
    pattern: cjkRe(`({CJK}) +(—+)`, "g"),
    replacement: "$1$2",
  },
  {
    pattern: cjkRe(`(—+) +({CJK})`, "g"),
    replacement: "$1$2",
  },
];

function punctuationCjkToFw(text: string): string {
  return text
    .replace(cjkRe("({CJK}),\\s*", "g"), "$1，")
    .replace(cjkRe("({CJK}):\\s*", "g"), "$1：")
    .replace(cjkRe("({CJK});\\s*", "g"), "$1；")
    .replace(cjkRe("({CJK})\\!\\s*", "g"), "$1！")
    .replace(cjkRe("({CJK})\\?\\s*", "g"), "$1？")
    .replace(cjkRe("({CJK})\\.\\s*", "g"), "$1。");
}

export const toFwExtraRules: ReplaceRule[] = [
  {
    pattern: /\.{3,}/g,
    replacement: (match: string) =>
      "…".repeat(Math.min(Math.ceil(match.length / 3), 2)),
  },
  {
    pattern: /… /g,
    replacement: "…",
  },
];

export function applyEllipsisRules(text: string): string {
  let result = text;
  for (const rule of toFwExtraRules) {
    result = result.replace(rule.pattern, rule.replacement as string);
  }
  return result;
}

export function applyFwPunctuationPipeline(text: string): string {
  return punctuationCjkToFw(text);
}

export const textPostprocess: ReplaceRule[] = [
  {
    pattern: cjkRe(`(”) +({CJK})`, "g"),
    replacement: "$1$2",
  },
];
