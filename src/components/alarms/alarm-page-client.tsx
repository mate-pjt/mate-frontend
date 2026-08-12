"use client";

import { useEffect, useRef, useState } from "react";

import { InfoIcon, UpArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { mockAlarms } from "@/mocks/alarms";
import type { AlarmNotification } from "@/types/alarm";

import { AlarmEmpty } from "./alarm-empty";
import { AlarmListItem } from "./alarm-list-item";

type PendingFocusTarget = "edit" | "empty-state" | "select-all";

export function AlarmPageClient() {
  const [alarms, setAlarms] = useState<AlarmNotification[]>(() =>
    mockAlarms.map((alarm) => ({ ...alarm })),
  );
  const [editing, setEditing] = useState(false);
  const [selectedAlarmIds, setSelectedAlarmIds] = useState<string[]>([]);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const emptyStateRef = useRef<HTMLElement>(null);
  const pendingFocusTargetRef = useRef<PendingFocusTarget | null>(null);
  const selectAllButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const pendingTarget = pendingFocusTargetRef.current;

    if (!pendingTarget) {
      return;
    }

    const targetElement =
      pendingTarget === "select-all"
        ? selectAllButtonRef.current
        : pendingTarget === "edit"
          ? editButtonRef.current
          : emptyStateRef.current;

    if (targetElement) {
      targetElement.focus();
      pendingFocusTargetRef.current = null;
    }
  }, [alarms.length, editing]);

  function markAsRead(alarmId: string) {
    setAlarms((currentAlarms) =>
      currentAlarms.map((alarm) => (alarm.id === alarmId ? { ...alarm, unread: false } : alarm)),
    );
  }

  function updateSelection(alarmId: string, selected: boolean) {
    setSelectedAlarmIds((currentIds) =>
      selected ? [...currentIds, alarmId] : currentIds.filter((id) => id !== alarmId),
    );
  }

  function enterEditMode() {
    pendingFocusTargetRef.current = "select-all";
    setSelectedAlarmIds([]);
    setEditing(true);
  }

  function finishEditing() {
    pendingFocusTargetRef.current = "edit";
    setSelectedAlarmIds([]);
    setEditing(false);
  }

  function selectAll() {
    setSelectedAlarmIds(alarms.map((alarm) => alarm.id));
  }

  function deleteSelectedAlarms() {
    if (selectedAlarmIds.length === 0) {
      return;
    }

    pendingFocusTargetRef.current =
      selectedAlarmIds.length === alarms.length ? "empty-state" : "edit";
    setAlarms((currentAlarms) => currentAlarms.filter((alarm) => !selectedAlarmIds.includes(alarm.id)));
    setSelectedAlarmIds([]);
    setEditing(false);
    showToast("선택한 소식을 삭제했어요!");
  }

  return (
    <>
      {alarms.length === 0 ? (
        <AlarmEmpty focusRef={emptyStateRef} />
      ) : (
        <section
          aria-labelledby="alarm-page-title"
          className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-4 pb-24 pt-[30px] sm:px-6 xl:px-0"
          id="alarms-page-top"
        >
          <header className="flex flex-col items-start p-2">
            <div className="flex flex-col gap-2.5">
              <h1 className="type-heading-1 text-grayscale-900" id="alarm-page-title">
                메이트가 사장님의 소식을 가져왔어요!
              </h1>
              <p className="type-heading-10 text-grayscale-600">
                메이트의 소식, 입찰 소식, 사장님의 모든 소식을 한 곳에서
              </p>
            </div>
          </header>

          <div className="flex flex-col gap-6">
            {editing ? (
              <div className="flex min-h-[38px] flex-wrap items-center justify-between gap-3">
                <Button onClick={selectAll} ref={selectAllButtonRef} variant="outline">
                  전체선택
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={selectedAlarmIds.length === 0}
                    onClick={deleteSelectedAlarms}
                    variant="danger"
                  >
                    삭제
                  </Button>
                  <Button onClick={finishEditing}>완료</Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[38px] flex-wrap items-center justify-between gap-3">
                <p className="type-body-7 flex items-center gap-2 text-grayscale-600">
                  <InfoIcon className="size-5 shrink-0" aria-hidden />
                  받은 소식은 7일이 지나면 자동으로 사라져요.
                </p>
                <Button onClick={enterEditMode} ref={editButtonRef} variant="tertiary">
                  편집
                </Button>
              </div>
            )}

            <ul aria-label="받은 소식" className="flex flex-col">
              {alarms.map((alarm, index) => (
                <li key={alarm.id}>
                  <AlarmListItem
                    alarm={alarm}
                    editing={editing}
                    index={index}
                    onRead={markAsRead}
                    onSelectedChange={updateSelection}
                    selected={selectedAlarmIds.includes(alarm.id)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {alarms.length >= 4 && (
            <a
              aria-label="알림 페이지 맨 위로 이동"
              className="fixed bottom-[50px] right-[50px] hidden size-16 items-center justify-center rounded-full bg-grayscale-800 text-white sm:inline-flex"
              href="#alarms-page-top"
            >
              <UpArrowIcon className="size-8" aria-hidden />
            </a>
          )}
        </section>
      )}

    </>
  );
}
