import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "Mate 사용자 개인화 영역입니다.",
  robots: noIndexRobots,
};

export default function MyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">My</p>
        <h1 className="mt-3 text-3xl font-semibold">마이페이지</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          사용자 정보, 관심 공고, 저장한 검색 조건이 들어갈 개인화 페이지입니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["관심 공고", "저장 검색", "계정 정보"].map((label) => (
          <section
            className="rounded-lg border border-border bg-surface p-5"
            key={label}
          >
            <h2 className="text-lg font-semibold">{label}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              API 연동 전 placeholder 영역입니다.
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
