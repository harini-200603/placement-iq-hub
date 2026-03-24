import { aptitudeContent } from "./aptitude";
import { reasoningContent } from "./reasoning";
import { verbalContent } from "./verbal";
import { hrInterviewContent } from "./hr-interview";
import { programmingContent } from "./programming";
import { webLanguagesContent } from "./web-languages";

const allContent: Record<string, Record<string, string>> = {
  aptitude: aptitudeContent,
  "logical-reasoning": reasoningContent,
  "verbal-ability": verbalContent,
  "hr-interview": hrInterviewContent,
  java: programmingContent,
  python: programmingContent,
  "c-lang": webLanguagesContent,
  html: webLanguagesContent,
  css: webLanguagesContent,
  javascript: webLanguagesContent,
};

export const getHardcodedContent = (subjectId: string, topicId: string): string | null => {
  const subjectContent = allContent[subjectId];
  if (!subjectContent) return null;
  return subjectContent[topicId] || null;
};
