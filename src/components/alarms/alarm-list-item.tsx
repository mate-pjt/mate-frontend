import Image from "next/image";

import { CheckboxCircle } from "@/components/ui/checkbox";
import type { AlarmKind, AlarmNotification } from "@/types/alarm";

const alarmIconPaths: Record<AlarmKind, string> = {
  bid: "/icon/24dp/bid_ing.svg",
  company: "/icon/24dp/company.svg",
  mate: "/icon/24dp/mate.svg",
};

type AlarmListItemProps = {
  alarm: AlarmNotification;
  editing: boolean;
  index: number;
  onRead: (alarmId: string) => void;
  onSelectedChange: (alarmId: string, selected: boolean) => void;
  selected: boolean;
};

export function AlarmListItem({
  alarm,
  editing,
  index,
  onRead,
  onSelectedChange,
  selected,
}: AlarmListItemProps) {
  const alternatingSurface = index % 2 === 0 ? "bg-grayscale-50" : "bg-basic-white";
  const selectionSummary = alarm.messageLines[alarm.messageLines.length - 1] ?? "알림";

  const content = (
    <div className="flex min-h-24 min-w-0 flex-1 items-stretch gap-2">
      <div className="flex min-w-0 flex-1 flex-col justify-center py-1.5">
        <div className="flex min-w-0 items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <div className="flex items-center gap-2">
                <Image
                  alt=""
                  aria-hidden
                  className="size-8"
                  height={32}
                  src={alarmIconPaths[alarm.kind]}
                  width={32}
                />
                <h2 className="type-heading-9 text-grayscale-800">{alarm.label}</h2>
              </div>
              <time className="type-body-3 shrink-0 text-grayscale-600" dateTime={alarm.receivedAt}>
                {alarm.receivedDate}
              </time>
            </div>
            <p className="type-body-3 text-grayscale-600">
              {alarm.messageLines.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </p>
          </div>
          {!editing && (
            <span className="flex h-full w-4 shrink-0 items-start" aria-hidden>
              {alarm.unread && (
                <Image className="size-4" src="/icon/24dp/state.svg" alt="" width={16} height={16} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (editing) {
    return (
      <div className={`flex w-full items-center gap-4 rounded-2xl p-4 ${alternatingSurface}`}>
        <CheckboxCircle
          active={selected}
          ariaLabel={`${index + 1}번째 ${alarm.label}, ${selectionSummary} 선택`}
          onActiveChange={(active) => onSelectedChange(alarm.id, active)}
          size="lg"
        />
        {content}
      </div>
    );
  }

  return (
    <button
      className={`w-full rounded-2xl p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${alternatingSurface}`}
      onClick={() => onRead(alarm.id)}
      type="button"
    >
      <span className="sr-only">{alarm.unread ? "미확인 소식" : "확인한 소식"}</span>
      {content}
    </button>
  );
}
