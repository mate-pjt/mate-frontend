import "server-only";

import type { QnaRepository } from "./contracts";
import { staticQnaRepository } from "./static-repository";

const qnaRepository: QnaRepository = staticQnaRepository;

export function getQnaItems() {
  return qnaRepository.getQnaItems();
}
