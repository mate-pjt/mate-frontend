import { qnaItems } from "./content";

import type { QnaRepository } from "./contracts";

export const staticQnaRepository: QnaRepository = {
  async getQnaItems() {
    return qnaItems;
  },
};
