import type { QnaItem } from "@/types/qna";

export interface QnaRepository {
  getQnaItems(): Promise<readonly QnaItem[]>;
}
