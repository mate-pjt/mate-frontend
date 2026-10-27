import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AccountScope } from "@/components/auth/account-scope";
import { noIndexRobots } from "@/lib/metadata";
import { DocumentRegistration } from "./registration-client";

export const metadata: Metadata = { title: "증명서로 회사 등록", robots: noIndexRobots };

export default function DocumentRegistrationPage() {
  return <AuthScreen><AccountScope><DocumentRegistration /></AccountScope></AuthScreen>;
}
