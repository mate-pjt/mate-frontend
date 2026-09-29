import Image from "next/image";

type BidListEmptyProps = {
  readonly hasResults?: boolean;
  readonly onFirstPage?: () => void;
};

export function BidListEmpty({ hasResults = false, onFirstPage }: BidListEmptyProps) {
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center gap-5 border-b border-grayscale-200 bg-white px-6 text-center">
      <Image alt="검색 결과 없음" height={120} src="/images/bids/no-result.svg" width={120} />
      <div className="space-y-2">
        <p className="text-grayscale-800 type-heading-7">
          {hasResults ? "현재 페이지에는 공고가 없어요" : "검색 결과가 없어요"}
        </p>
        <p className="text-grayscale-500 type-body-5">
          {hasResults ? "다른 페이지에서 공고를 확인해 주세요." : "검색어나 필터 조건을 바꿔 다시 확인해 주세요."}
        </p>
      </div>
      {hasResults && onFirstPage ? (
        <button
          className="rounded-lg bg-primary-400 px-5 py-3 text-white type-body-2 hover:bg-primary-500"
          onClick={onFirstPage}
          type="button"
        >
          첫 페이지로 이동
        </button>
      ) : null}
    </div>
  );
}
