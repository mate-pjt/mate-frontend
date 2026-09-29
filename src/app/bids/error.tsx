"use client";

export default function BidListError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[520px] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-grayscale-800 type-heading-7">입찰공고를 불러오지 못했어요</h1>
      <p className="mt-3 text-grayscale-600 type-body-5">잠시 후 다시 시도해 주세요.</p>
      <button
        className="mt-6 rounded-lg bg-primary-400 px-5 py-3 text-white type-body-2 hover:bg-primary-500"
        onClick={reset}
        type="button"
      >
        다시 시도
      </button>
    </main>
  );
}
