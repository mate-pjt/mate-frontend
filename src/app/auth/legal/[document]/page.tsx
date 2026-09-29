import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthCard, AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";

type LegalPageProps = { params: Promise<{ document: string }> };

export const metadata: Metadata = { title: "개발용 임시 약관", robots: noIndexRobots };

export default async function LegalPage({ params }: LegalPageProps) {
  const { document } = await params;
  if (document !== "terms" && document !== "privacy") notFound();
  const isPrivacy = document === "privacy";

  return (
    <AuthScreen>
      <AuthCard className="space-y-5">
        <p className="rounded-lg bg-primary-100 p-3 text-primary type-body-7">개발·테스트용 임시 본문 · 정식 약관이 아닙니다</p>
        <h1 className="text-grayscale-800 type-heading-7">{isPrivacy ? "개인정보처리방침" : "서비스 이용약관"}</h1>
        <p className="text-grayscale-700 type-body-3">
          이 페이지는 메이트 개발 과정에서 가입 화면과 동의 기능을 확인하기 위한 임시 문구입니다.
          서비스 이용 조건이나 개인정보 처리 내용을 확정하여 고지하는 문서가 아닙니다.
        </p>
        <p className="text-grayscale-700 type-body-3">
          테스트에는 실제 개인정보나 실제 회사 서류를 사용하지 마세요.
          정식 본문이 확정되면 별도 버전으로 게시하고 필요한 동의 절차를 다시 정할 예정입니다.
        </p>
      </AuthCard>
    </AuthScreen>
  );
}
