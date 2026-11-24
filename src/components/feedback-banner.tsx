import Image from "next/image";

import { RightArrowIcon } from "@/components/icons";

export function FeedbackBanner() {
  return (
    <aside className="mt-[50px] flex flex-col gap-4 rounded-2xl bg-primary-100 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <Image
          alt=""
          className="size-12 shrink-0"
          height={48}
          src="/icon/24dp/mate.svg"
          width={48}
        />
        <div className="min-w-0">
          <h2 className="type-heading-9 text-grayscale-800">
            여러분의 의견으로 새로워지는 메이트!
          </h2>
          <p className="type-body-3 text-grayscale-600">
            이용 중 불편했던 점이나 바라는 점을 알려주시면 빠르게 반영할게요!
          </p>
        </div>
      </div>
      <a
        className="inline-flex h-12 shrink-0 items-center gap-1 self-end rounded-xl px-[18px] type-body-2 text-primary-700 hover:bg-primary-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 sm:self-auto"
        href="https://forms.gle/1ivGbvqpXNcWx5Vy8"
        rel="noopener noreferrer"
        target="_blank"
      >
        의견 보내기 <RightArrowIcon aria-hidden className="size-5" />
        <span className="sr-only"> (새 탭에서 열림)</span>
      </a>
    </aside>
  );
}
