import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AuthGate } from "@/components/auth/auth-gate";
import { AuthBack, AuthCard, AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "우리 회사 등록하기", robots: noIndexRobots };

const methods = [
  {
    href: "/auth/company/register/document",
    icon: "/icon/24dp/documents.svg",
    title: "사업자등록증명서로 등록하기",
    description: <>사업자등록증명을 확인하고<br />인증 회사로 등록해요!</>,
    recommended: true,
  },
  {
    href: "/auth/company/register/business-number",
    icon: "/images/auth/company-number.png",
    title: "사업자등록번호로 조회하기",
    description: <>회사 정보를 먼저 확인한 뒤,<br />미인증 회사로 등록해요!</>,
    recommended: false,
  },
];

export default function RegisterCompanyPage() {
  return (
    <AuthScreen>
      <AuthGate>
        <AuthCard>
          <AuthBack href="/auth/start" />
          <h1 className="mb-6 text-grayscale-800 type-heading-7">우리 회사를<br />어떤 방법으로 등록할까요?</h1>
          <div className="grid gap-[10px] sm:grid-cols-2">
            {methods.map((method) => (
              <Link className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl bg-grayscale-50 p-6 text-center transition-colors hover:bg-grayscale-100" href={method.href} key={method.href}>
                <span className={`rounded-md bg-primary-100 px-2 py-1 text-primary type-body-7 ${method.recommended ? "" : "invisible"}`}>메이트 추천</span>
                <Image src={method.icon} alt="" width={64} height={64} />
                <span className="text-grayscale-800 type-body-1">{method.title}</span>
                <span className="text-grayscale-600 type-body-7">{method.description}</span>
              </Link>
            ))}
          </div>
        </AuthCard>
      </AuthGate>
    </AuthScreen>
  );
}
