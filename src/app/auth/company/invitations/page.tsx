import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { InvitationClient } from "./invitation-client";

export const metadata: Metadata = { title: "팀 초대", robots: noIndexRobots };

export default function InvitationPage() {
  return <AuthScreen><InvitationClient /></AuthScreen>;
}
