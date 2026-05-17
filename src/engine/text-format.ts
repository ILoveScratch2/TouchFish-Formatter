import pangu from "pangu";
import {
  textPreprocess,
  applyEllipsisRules,
  applyFwPunctuationPipeline,
  textPostprocess,
} from "./punctuation";


type TextTransform = (s: string) => string;

const collapseAndTrim: TextTransform = (s) => s.replace(/ +/g, " ").trim();

const cjkLatinSpacing: TextTransform = (s) => pangu.spacing(s);

function regexStep(pattern: RegExp, replacement: string): TextTransform {
  return (s) => s.replace(pattern, replacement);
}

const fwPunctuationSteps: TextTransform[] = [
  regexStep(/，\s*/g, ", "),
  regexStep(/：\s*/g, ": "),
  regexStep(/；\s*/g, "; "),
  regexStep(/！\s*/g, "! "),
  regexStep(/？\s*/g, "? "),
  regexStep(/。\s*/g, ". "),
];

export function formatTextNode(content: string, useFullWidth: boolean, ellipsisToFw = true): string {
  const hadLeadingSpace = content.length > 0 && content[0] === " ";
  const hadTrailingSpace = content.length > 0 && content[content.length - 1] === " ";

  const pipeline: TextTransform[] = [collapseAndTrim, cjkLatinSpacing];

  for (const rule of textPreprocess) {
    pipeline.push(regexStep(rule.pattern, rule.replacement as string));
  }

  if (ellipsisToFw) {
    pipeline.push(applyEllipsisRules);
  }

  if (useFullWidth) {
    pipeline.push(applyFwPunctuationPipeline);
  } else {
    for (const step of fwPunctuationSteps) {
      pipeline.push(step);
    }
    if (!hadTrailingSpace) {
      pipeline.push((s) => s.trimEnd());
    }
  }

  for (const rule of textPostprocess) {
    pipeline.push(regexStep(rule.pattern, rule.replacement as string));
  }

  let result = content;
  for (const transform of pipeline) {
    result = transform(result);
  }

  if (hadLeadingSpace) result = " " + result;
  if (hadTrailingSpace) result = result + " ";

  return result;
}
