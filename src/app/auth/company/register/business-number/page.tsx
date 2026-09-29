import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { BusinessNumberRegistration } from "./registration-client";

export const metadata: Metadata = { title: "사업자등록번호로 회사 등록", robots: noIndexRobots };

export default function BusinessNumberRegistrationPage() {
  return <AuthScreen><BusinessNumberRegistration /></AuthScreen>;
}
