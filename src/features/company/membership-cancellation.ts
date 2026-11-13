import type { CompanyOverview, MembershipCancellationResult, MyMembershipRequest } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";

type CancellationPort = {
  getAccountKey: () => string | null;
  cancel: (requestId: number, expectedVersion: number) => Promise<MembershipCancellationResult>;
  load: (signal: AbortSignal) => Promise<CompanyOverview>;
  onPending: (pending: boolean) => void;
  onCommitted: (result: MembershipCancellationResult) => void;
  onOverview: (overview: CompanyOverview) => void;
  onError: (message: string, error?: unknown) => void;
  onNotice: (message: string) => void;
};

export function createMembershipCancellationController(port: CancellationPort) {
  const account = port.getAccountKey();
  const controller = new AbortController();
  const submitted = new Set<string>();
  let active = true;
  let pending = false;
  const current = () => active && account !== null && port.getAccountKey() === account;

  async function submit(snapshot: MyMembershipRequest) {
    const { requestId, version } = snapshot;
    const key = `${requestId}:${version}`;
    if (!current() || pending || submitted.has(key) || snapshot.status !== "PENDING") return;
    submitted.add(key);
    pending = true;
    port.onPending(true);
    try {
      const result = await port.cancel(requestId, version);
      if (!current()) return;
      port.onCommitted(result);
      if (result.sessionWarning) return;
      try {
        const overview = await port.load(controller.signal);
        if (current()) port.onOverview(overview);
      } catch (error) {
        if (!current()) return;
        if (error instanceof ApiError && error.status === 401) {
          port.onNotice("통합 요청 취소는 완료됐어요. 다시 로그인한 뒤 최신 회사 상태를 확인해 주세요.");
          port.onError("최신 회사 상태를 확인하려면 로그인이 필요해요.", error);
        } else port.onNotice("통합 요청 취소는 완료됐지만 최신 회사 상태를 확인하지 못했어요. 다시 확인해 주세요.");
      }
    } catch (error) {
      if (!current()) return;
      port.onError(`취소 결과를 확인하지 못했어요. 최신 상태를 다시 확인해 주세요. ${errorMessage(error)}`, error);
      if (error instanceof ApiError && (error.status === 409 || error.status === 404)) {
        try {
          const overview = await port.load(controller.signal);
          if (!current()) return;
          port.onOverview(overview);
          port.onNotice("신청 상태가 변경됐어요. 최신 상태를 확인한 후 다시 진행해 주세요.");
        } catch (error) {
          if (current()) port.onError("취소 결과와 최신 회사 상태를 확인하지 못했어요. 다시 시도하기로 상태를 확인해 주세요.", error);
        }
      }
    } finally {
      pending = false;
      if (current()) port.onPending(false);
    }
  }

  return { submit, dispose() { active = false; controller.abort(); } };
}
