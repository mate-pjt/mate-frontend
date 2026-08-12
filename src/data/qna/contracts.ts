import type { QnaItem } from "@/types/qna";

export interface QnaReader {
  getQnaItems(): Promise<readonly QnaItem[]>;
}
