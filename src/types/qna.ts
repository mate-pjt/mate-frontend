export type QnaTextSegment = {
  readonly text: string;
  readonly emphasis?: boolean;
  readonly underline?: boolean;
};

export type QnaAnswer = {
  readonly paragraphs: readonly (readonly QnaTextSegment[])[];
  readonly listItems?: readonly (readonly QnaTextSegment[])[];
};

export type QnaItem = {
  readonly question: string;
  readonly answer: QnaAnswer;
};
