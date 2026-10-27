"use client";

import { useSyncExternalStore } from "react";
import { dataGroups, getDataConfig } from "@/data/config";
import { getMockRuntime } from "@/data/mock/runtime";

function subscribe(listener: () => void) {
  window.addEventListener("mate:mock-storage-changed", listener);
  return () => window.removeEventListener("mate:mock-storage-changed", listener);
}
export function MockStatus() {
  const config = getDataConfig();
  const groups = dataGroups.filter(group => config.sources[group] === "mock");
  const persistent = useSyncExternalStore(subscribe, () => groups.length ? getMockRuntime().store.persistent : true, () => true);
  if (!groups.length) return null;
  return (
    <details className="fixed bottom-3 left-3 z-50 max-w-[calc(100vw-24px)] rounded-xl border border-warning bg-basic-white p-3 text-grayscale-800 shadow-lg type-body-7">
      <summary className="cursor-pointer">개발용 Mock · {groups.length}개 그룹</summary>
      <p className="mt-2 break-words">{groups.join(", ")}</p>
      {!persistent && <p className="mt-2 text-warning" role="status">탭 저장소를 사용할 수 없어 새로고침하면 변경 상태가 초기화됩니다.</p>}
      <button className="mt-3 text-primary underline" onClick={() => { getMockRuntime().store.reset(); window.location.reload(); }} type="button">Mock 상태 초기화</button>
    </details>
  );
}
