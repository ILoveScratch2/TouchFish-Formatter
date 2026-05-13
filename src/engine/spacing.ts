import { isCjk, isCjkPunct, isHwPunct, toFullWidth } from "./punctuation";

const PUNCT_AT_START = /^[!\?.,:;] */;


export interface TextBoundaryResult {
  adjustedLeft: string;
  adjustedRight: string;
  separator: boolean;
  carryTrim: boolean;
}

type CharClass = "cjk" | "cjk-punct" | "hw-punct" | "other";

function classify(ch: string): CharClass {
  if (isCjkPunct(ch)) return "cjk-punct";
  if (isCjk(ch)) return "cjk";
  if (isHwPunct(ch)) return "hw-punct";
  return "other";
}

type BoundaryRule = (
  prev: string,
  next: string,
  wasTrimmed: boolean,
  extraGap: boolean,
) => TextBoundaryResult | null;

const boundaryRules: BoundaryRule[] = [
  (prev, next) => {
    if (classify(prev) === "cjk-punct" || classify(next) === "cjk-punct") {
      return { adjustedLeft: prev, adjustedRight: next, separator: false, carryTrim: false };
    }
    return null;
  },

  (prev, next, _wasTrimmed, _extraGap) => {
    if (classify(prev) === "cjk" && PUNCT_AT_START.test(next)) {
      const promoted = next.replace(PUNCT_AT_START, (m) => toFullWidth(m.trim()));
      return { adjustedLeft: prev, adjustedRight: promoted, separator: false, carryTrim: false };
    }
    return null;
  },

  (prev, next, wasTrimmed, extraGap) => {
    if (classify(prev) === "cjk" && classify(next) === "cjk") {
      const need = wasTrimmed || extraGap;
      return {
        adjustedLeft: prev,
        adjustedRight: next,
        separator: need,
        carryTrim: extraGap ? false : wasTrimmed,
      };
    }
    return null;
  },

  (prev, next, _wasTrimmed, _extraGap) => {
    const a = classify(prev) === "cjk";
    const b = classify(next) === "cjk";
    if (a !== b) {
      return { adjustedLeft: prev, adjustedRight: next, separator: true, carryTrim: false };
    }
    return null;
  },

  (prev, next, wasTrimmed, _extraGap) => {
    const a = classify(prev) !== "cjk";
    const b = classify(next) !== "cjk";
    if (a && b) {
      return { adjustedLeft: prev, adjustedRight: next, separator: wasTrimmed, carryTrim: false };
    }
    return null;
  },
];

export function analyzeTextBoundary(
  rawLeft: string,
  rawRight: string,
  extraGap: boolean,
): TextBoundaryResult {
  const coreLeft = rawLeft.trimEnd();
  const coreRight = rawRight.trimStart();

  const trimmed = coreLeft.length !== rawLeft.length || coreRight.length !== rawRight.length;

  const prev = coreLeft.length > 0 ? coreLeft[coreLeft.length - 1] : "";
  const next = coreRight.length > 0 ? coreRight[0] : "";

  if (!prev || !next) {
    return { adjustedLeft: coreLeft, adjustedRight: coreRight, separator: false, carryTrim: false };
  }

  for (const rule of boundaryRules) {
    const outcome = rule(prev, next, trimmed, extraGap);
    if (outcome) {
      return {
        ...outcome,
        adjustedLeft: coreLeft.slice(0, -1) + prev + coreLeft.slice(-1).replace(prev, ""),
        adjustedRight: next + coreRight.slice(1),
      };
    }
  }

  return { adjustedLeft: coreLeft, adjustedRight: coreRight, separator: false, carryTrim: false };
}

export function gapAfterText(edgeChar: string, textChar: string, wasTrimmed: boolean): boolean {
  if (!textChar) return false;

  if (classify(edgeChar) === "cjk-punct" || classify(textChar) === "cjk-punct") return false;

  if (classify(edgeChar) === "hw-punct" && classify(textChar) !== "hw-punct") return true;

  if (classify(edgeChar) !== "hw-punct" && classify(textChar) === "hw-punct") return false;

  if (isCjk(edgeChar) === isCjk(textChar)) return wasTrimmed;

  return true;
}
