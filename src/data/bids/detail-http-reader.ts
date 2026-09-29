import "server-only";

import type { CommonResponse } from "./api-types";
import type { BidDetailReader } from "./contracts";
import {
  mapAttachments,
  mapBidDetail,
  mapParticipantPage,
  mapPurchases,
  mapRelated,
  mapResults,
} from "./detail-api-mapper";
import type {
  BidNoticeAttachmentListDto,
  BidNoticeDetailDto,
  BidNoticePurchaseItemDto,
  BidNoticeResultsDto,
  BidParticipantPageDto,
  RelatedBidNoticeDto,
} from "./detail-api-types";
import type { BidParticipant, DetailSection } from "@/types/bid-detail";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_MATE_API_BASE_URL?.replace(/\/+$/, "") || "https://api-test.mate-bid.com";

export const httpBidDetailReader: BidDetailReader = {
  async getBidDetail(query) {
    if (!validId(query.id)) return null;

    const base = `/api/v1/bid-notices/${query.id}`;
    const selection = query.classificationNo ? `?${new URLSearchParams({ bidClsfcNo: query.classificationNo })}` : "";
    const detailDto = await getData<BidNoticeDetailDto>(`${base}${selection}`, true);
    if (!detailDto) return null;
    if (String(detailDto.id) !== query.id) throw new Error("입찰공고 상세 ID가 일치하지 않습니다.");

    const bid = mapBidDetail(detailDto);
    const selectedClass = bid.classificationNo ? `bidClsfcNo=${encodeURIComponent(bid.classificationNo)}` : "";
    const classified = (path: string, params?: string) => {
      const values = [selectedClass, params].filter(Boolean).join("&");
      return `${base}/${path}${values ? `?${values}` : ""}`;
    };

    const [attachments, related, results, purchases] = await Promise.all([
      section(() => getData<BidNoticeAttachmentListDto>(`${base}/attachments`).then((data) => {
        assertSectionId(data, query.id);
        return mapAttachments(data, apiBaseUrl);
      })),
      section(() => getData<RelatedBidNoticeDto>(classified("related-notices", "page=0&size=3")).then(mapRelated)),
      section(() => getData<BidNoticeResultsDto>(classified("bid-results")).then((data) => {
        assertSectionId(data, query.id);
        return mapResults(data);
      })),
      bid.bidType !== "goods" ? Promise.resolve(null) : section(() =>
        getData<BidNoticePurchaseItemDto>(classified("purchase-items", `page=${query.itemPage - 1}&size=10`)).then((data) => {
          assertSectionId(data, query.id);
          return mapPurchases(data);
        }),
      ),
    ]);

    const selectedResult = results.status === "ready"
      ? results.data.find((item) => item.id === query.resultId) ?? results.data[0]
      : null;
    const loadParticipantPage = (resultId: string, page: number, size: number) => getData<BidParticipantPageDto>(
      `${base}/bid-results/${resultId}/participants?page=${page}&size=${size}`,
    ).then((data) => {
        assertSectionId(data, query.id);
        if (String(data.bidResultId) !== resultId) throw new Error("개찰결과 회차가 일치하지 않습니다.");
        return mapParticipantPage(data);
      });
    const [participants, firstPage] = selectedResult
      ? await Promise.all([
        section(() => loadParticipantPage(selectedResult.id, query.participantsPage - 1, 20)),
        query.participantsPage === 1 ? Promise.resolve(null) : section(() => loadParticipantPage(selectedResult.id, 0, 3)),
      ])
      : [null, null];
    const podiumSource = firstPage ?? participants;
    const podium: DetailSection<readonly BidParticipant[]> | null = podiumSource?.status === "ready"
      ? { status: "ready", data: podiumSource.data.items.slice(0, 3) }
      : podiumSource?.status === "error" ? { status: "error", data: null } : null;

    return { bid, attachments, related, results, purchases, selectedResultId: selectedResult?.id ?? null, participants, podium };
  },
};

function getData<T>(path: string): Promise<T>;
function getData<T>(path: string, allowNotFound: true): Promise<T | null>;
async function getData<T>(path: string, allowNotFound = false): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new Error("입찰공고 서버에 연결하지 못했습니다.");
  }

  if (allowNotFound && response.status === 404) return null;
  const payload = await response.json().catch(() => null) as CommonResponse<T> | null;
  if (!response.ok || payload?.isSuccess !== true || payload.data == null) {
    throw new Error("입찰공고 정보를 불러오지 못했습니다.");
  }
  return payload.data;
}

async function section<T>(load: () => Promise<T>): Promise<DetailSection<T>> {
  try {
    return { status: "ready", data: await load() };
  } catch {
    return { status: "error", data: null };
  }
}

function assertSectionId(data: { bidNoticeId: number }, id: string) {
  if (String(data.bidNoticeId) !== id) throw new Error("입찰공고 섹션 ID가 일치하지 않습니다.");
}

function validId(value: string) {
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value));
}
