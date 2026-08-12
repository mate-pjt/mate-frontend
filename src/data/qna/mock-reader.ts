import { mockQnaItems } from "@/mocks/qna";

import type { QnaReader } from "./contracts";

export const mockQnaReader: QnaReader = {
  async getQnaItems() {
    return mockQnaItems;
  },
};
