import type { Metadata } from "next";
import { AlarmPageClient } from "@/components/alarms/alarm-page-client";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "알람",
  description: "Mate 사용자 알람 페이지입니다.",
  robots: noIndexRobots,
};

export default function AlarmsPage() {
  return <AlarmPageClient />;
}
