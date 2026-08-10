import Image from "next/image";

export function BidListEmpty() {
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center gap-5 border-b border-grayscale-200 bg-white px-6 text-center">
      <Image alt="검색 결과 없음" height={120} src="/images/bids/no-result.svg" width={120} />
      <div className="space-y-2">
        <p className="text-grayscale-800 type-heading-7">검색 결과가 없어요</p>
        <p className="text-grayscale-500 type-body-5">검색어나 필터 조건을 바꿔 다시 확인해 주세요.</p>
      </div>
    </div>
  );
}
