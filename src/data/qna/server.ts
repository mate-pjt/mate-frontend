import "server-only";

import type { QnaReader } from "./contracts";
import { mockQnaReader } from "./mock-reader";

const qnaReader: QnaReader = mockQnaReader;

export function getQnaItems() {
  return qnaReader.getQnaItems();
}
