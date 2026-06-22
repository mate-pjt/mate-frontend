import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "알람",
  description: "Mate 사용자 알람 페이지입니다.",
  robots: noIndexRobots,
};

const alarmPlaceholders = [
  "관심 공고 마감 3일 전 알림",
  "새 검색 조건 매칭 알림",
  "입찰공고 변경사항 알림",
];

export default function AlarmsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Alarms</p>
        <h1 className="mt-3 text-3xl font-semibold">알람</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          사용자별 알림 목록과 읽음 처리 로직을 붙일 예정입니다.
        </p>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border bg-surface">
        {alarmPlaceholders.map((alarm) => (
          <div className="p-5" key={alarm}>
            <h2 className="text-base font-semibold">{alarm}</h2>
            <p className="mt-2 text-sm text-muted">mock notification</p>
          </div>
        ))}
      </div>
    </div>
  );
}
