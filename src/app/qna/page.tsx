import type { Metadata } from "next";
import { getQnaItems } from "@/data/qna/server";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicPageMetadata({
  title: "자주 묻는 질문",
  description:
    "Mate 서비스 이용, 입찰공고 데이터, 회원가입과 로그인에 관한 자주 묻는 질문입니다.",
  path: "/qna",
});

export default async function QnaPage() {
  const qnaItems = await getQnaItems();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Q&A</p>
        <h1 className="mt-3 text-3xl font-semibold">자주 묻는 질문</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          공개 SEO 대상 페이지로 metadata와 서버 렌더링 구조를 우선 잡았습니다.
        </p>
      </div>

      <div className="space-y-4">
        {qnaItems.map((item) => (
          <section
            className="rounded-lg border border-border bg-surface p-5"
            key={item.question}
          >
            <h2 className="text-lg font-semibold">{item.question}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{item.answer}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
