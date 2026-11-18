"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox";
import { TextInput } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { membershipRejectionReason, type TeamMembershipApproval, type TeamMembershipRequest, type TeamRole } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { createMembershipReviewScope, defaultMembershipApproval, membershipApplicantName, planMembershipApproval, requestedMembershipPosition, type TeamMembershipSnapshot } from "@/features/company/team-membership-requests";
import { teamDate, teamRoleLabel } from "@/features/company/team";

export function TeamMembershipReviewDialog({ snapshot, access, getSessionEpoch, onClose, onCommitted, onAccessError }: {
  snapshot: TeamMembershipSnapshot & { detail: TeamMembershipRequest }; access: AuthAccess; getSessionEpoch: () => number;
  onClose: (submitted: boolean) => void; onCommitted: (value: TeamMembershipRequest) => void; onAccessError: (error: ApiError) => void;
}) {
  const row = snapshot.detail, initial = defaultMembershipApproval(row), c = row.capabilities, actor = snapshot.current.permissionCodes;
  const dialog = useRef<HTMLDialogElement>(null), active = useRef<ReturnType<typeof createMembershipReviewScope> | null>(null);
  const live = useRef(false), epoch = useRef(getSessionEpoch()), fieldId = useId();
  const [representative, setRepresentative] = useState(initial.representative), [position, setPosition] = useState(initial.positionId === null ? "new" : String(initial.positionId));
  const [positionName, setPositionName] = useState(initial.positionName ?? ""), [preset, setPreset] = useState<TeamRole>(initial.preset ?? "VIEWER"), [extras, setExtras] = useState<string[]>([]);
  const [rejecting, setRejecting] = useState(false), [reason, setReason] = useState(""), [pending, setPending] = useState(false), [submitted, setSubmitted] = useState(false), [error, setError] = useState("");
  const canEdit = c.canEditPosition && actor.includes("COMPANY_MEMBER_PROFILE_EDIT"), canManage = c.canManagePermissions && actor.includes("COMPANY_MEMBER_PERMISSION_MANAGE");
  const base = snapshot.catalog.presets.find(p => p.role === preset)!.permissionCodes;
  const selected = representative ? snapshot.catalog.presets.find(p => p.role === "ADMIN")!.permissionCodes : [...new Set([...base, ...extras])];
  const body: TeamMembershipApproval = { expectedVersion: row.version, representative, positionId: representative || position === "new" ? null : Number(position),
    positionName: representative || position !== "new" ? null : positionName, preset: representative ? null : preset, extraPermissionCodes: representative ? [] : extras.filter(code => !base.includes(code)) };
  let valid = false, validation = "";
  try { planMembershipApproval(snapshot, row, body); valid = true; } catch (cause) { validation = errorMessage(cause); }
  let validReason = false; try { membershipRejectionReason(reason); validReason = true; } catch { /* Show validation after input. */ }

  useEffect(() => {
    live.current = true; const element = dialog.current; element?.showModal();
    return () => { live.current = false; active.current?.dispose(); element?.close(); };
  }, []);
  useEffect(() => { if (rejecting) document.getElementById(`${fieldId}-reason`)?.focus(); }, [rejecting, fieldId]);
  function close() { if (pending) return; active.current?.dispose(); dialog.current?.close(); onClose(submitted); }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (pending || submitted || active.current) return;
    if (rejecting ? !validReason : !valid) return;
    setPending(true); setSubmitted(true); setError("");
    const scope = createMembershipReviewScope(access, () => live.current && epoch.current === getSessionEpoch()); active.current = scope;
    try {
      const value = await scope.submit(snapshot, rejecting ? { kind: "reject", reason } : { kind: "approve", input: body });
      if (!live.current || epoch.current !== getSessionEpoch()) return;
      dialog.current?.close(); onCommitted(value);
    } catch (cause) {
      if (!live.current || epoch.current !== getSessionEpoch() || cause instanceof DOMException && cause.name === "AbortError") return;
      if (cause instanceof ApiError && [401, 403].includes(cause.status)) { dialog.current?.close(); onAccessError(cause); return; }
      setError(`${errorMessage(cause)} 처리 결과를 확인하지 못했어요. 닫고 현재 신청 상태부터 확인해 주세요.`);
    } finally { if (live.current && epoch.current === getSessionEpoch()) setPending(false); }
  }
  return <dialog ref={dialog} aria-label="합류 신청 검토" aria-busy={pending} onCancel={event => { event.preventDefault(); close(); }}
    className="m-auto max-h-[min(908px,90dvh)] w-[calc(100vw-2rem)] max-w-[640px] overflow-y-auto rounded-[20px] border border-grayscale-200 bg-white p-0 text-grayscale-800 shadow-(--shadow-floating) backdrop:bg-grayscale-900/30">
    <form onSubmit={submit}>
      <div className="p-6 pb-0">
        <div className="flex justify-end"><button type="button" aria-label="신청 검토 창 닫기" disabled={pending} onClick={close} className="inline-flex size-6 items-center justify-center disabled:opacity-40"><CloseIcon className="size-6" /></button></div>
        <h2 className="mt-2 mb-6 type-heading-7">{rejecting ? "합류 신청을 거절하시겠어요?" : <>팀원으로 함께할지<br />신청 정보를 확인해 주세요!</>}</h2>
        <div className="mb-6 rounded-2xl bg-grayscale-50 p-4">
          <div className="mb-4 flex items-center gap-4"><Image src="/icon/24dp/ceo.svg" width={40} height={40} alt="" />
            <div className="min-w-0"><h3 className="break-all type-body-1">{membershipApplicantName(row)}</h3><p className="mt-1 break-all type-body-7 text-grayscale-600">{row.googleVerifiedEmail || "확인 이메일 미제공"}</p></div></div>
          <dl className="space-y-3 type-body-7">{[["신청유형", row.requestedRepresentative ? "대표자" : "팀원"], ["신청직급", requestedMembershipPosition(row)], ["메시지", row.message || "없음"], ["신청일", teamDate(row.createdAt, true)]].map(([label, value]) =>
            <div className="grid grid-cols-[5rem_1fr] gap-2" key={label}><dt className="text-grayscale-600">{label}</dt><dd className="break-all">{value}</dd></div>)}</dl>
        </div>
        <fieldset disabled={pending || submitted} className="space-y-6">
          {rejecting ? <div className="space-y-2"><label htmlFor={`${fieldId}-reason`} className="type-body-3">거절 사유</label>
            <TextInput id={`${fieldId}-reason`} className="w-full!" value={reason} onValueChange={setReason} maxLength={300} placeholder="거절 사유를 1~300자로 입력해 주세요." autoComplete="off" />
            <p className="type-body-7 text-grayscale-600">신청자가 거절 사유를 확인할 수 있어요. 앞뒤 공백을 제외한 사유를 저장해요.</p>
            {reason && !validReason && <p role="status" className="type-body-7 text-danger-emphasis">공백과 제어 문자를 제외하고 1~300자로 입력해 주세요.</p>}</div> : <>
            <fieldset><legend className="mb-2 type-body-3">대표자 여부</legend><div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" className={`h-12 bg-white! ${!representative ? "outline-primary-400! text-primary-400!" : ""}`} aria-pressed={!representative} disabled={row.requestedRepresentative && !canEdit} onClick={() => setRepresentative(false)}>팀원</Button>
              <Button type="button" variant="outline" className={`h-12 bg-white! ${representative ? "outline-primary-400! text-primary-400!" : ""}`} aria-pressed={representative} disabled={!row.requestedRepresentative || !c.canApproveRepresentative} onClick={() => setRepresentative(true)}>대표자</Button>
            </div><div className="mt-2 flex items-start gap-1 rounded-xl bg-grayscale-50 px-4 py-6 type-body-6 text-grayscale-700"><Image src="/icon/24dp/important.svg" width={20} height={20} alt="" />대표자는 대표자 직급과 관리자 전체 권한이 자동으로 적용돼요. 원래 대표자 신청이며 관리자가 승인하고, 현재 대표자가 없어야 해요.</div></fieldset>
            {!representative && <div className="space-y-2"><p className="type-body-3">부여할 직급</p>
              <Select ariaLabel="부여할 직급" className="w-full" boxClassName="h-12! w-full! justify-between! font-medium!" value={position} onValueChange={setPosition} disabled={!canEdit || pending || submitted}
                options={[...snapshot.positions.filter(p => p.type === "CUSTOM").map(p => ({ value: String(p.id), label: p.name })), ...(canEdit || row.proposedPositionName ? [{ value: "new", label: "새 직급명 입력" }] : [])]} />
              {position === "new" && <div className="space-y-2"><label htmlFor={`${fieldId}-position`} className="type-body-7">새 직급명</label><TextInput id={`${fieldId}-position`} className="w-full!" value={positionName} onValueChange={setPositionName} readOnly={!canEdit} maxLength={30} placeholder="새 일반 직급명을 입력해 주세요." /></div>}
            </div>}
            {!representative && <div className="space-y-4 border-t border-grayscale-200 pt-6">
              <fieldset><legend className="mb-2 type-body-3">부여할 역할</legend><div className="grid grid-cols-3 gap-2">{(["ADMIN", "AGENT", "VIEWER"] as const).map(role => {
                const available = snapshot.catalog.presets.find(p => p.role === role)!.permissionCodes.every(code => actor.includes(code)) && (role === "VIEWER" || canManage);
                return <Button type="button" key={role} variant="outline" className={`h-12 bg-white! ${preset === role ? "outline-primary-400! text-primary-400!" : ""}`} aria-pressed={preset === role} disabled={!available} onClick={() => { setPreset(role); setExtras([]); }}>{teamRoleLabel(role)}</Button>;
              })}</div></fieldset>
              {snapshot.catalog.categories.map(category => <details key={category.code} className="rounded-lg bg-grayscale-50 p-4"><summary className="cursor-pointer type-body-1 text-grayscale-700">{category.name} 권한 <span className="ml-2 type-body-7 text-primary-400">{category.permissions.filter(p => selected.includes(p.code)).length}개의 권한을 선택했어요!</span></summary>
                <div className="mt-4 space-y-3">{category.permissions.map(permission => <label className="flex items-start gap-2 type-body-7" key={permission.code}><CheckboxSquare checked={selected.includes(permission.code)} ariaLabel={permission.name}
                  disabled={pending || submitted || !canManage || base.includes(permission.code) || !actor.includes(permission.code)} onCheckedChange={checked => setExtras(values => checked ? [...new Set([...values, permission.code])] : values.filter(v => v !== permission.code))} />
                  <span>{permission.name}<span className="mt-1 block text-grayscale-600">{permission.description}</span></span></label>)}</div></details>)}
            </div>}
            {!valid && <p role="status" className="type-body-7 text-danger-emphasis">{validation}</p>}
          </>}
        </fieldset>
        {error && <div className="mt-4 rounded-xl bg-grayscale-50 p-4 type-body-7 text-danger-emphasis" role="alert">{error}</div>}
      </div>
      <div className="sticky bottom-0 bg-white p-6">
        {submitted && !pending ? <Button type="button" size="xxl" className="w-full!" onClick={close}>닫고 신청 상태 확인하기</Button> : <div className="flex gap-2.5">
          <Button type="button" variant={rejecting ? "gray" : "danger"} size="xxl" className="min-w-0 flex-1" disabled={pending} onClick={() => { setRejecting(value => !value); setError(""); }}>{rejecting ? "돌아가기" : "거절하기"}</Button>
          <Button type="submit" variant={rejecting ? "danger" : "primary"} size="xxl" className="min-w-0 flex-1" disabled={pending || (rejecting ? !validReason : !valid)}>{pending ? "처리 요청 중…" : rejecting ? "거절하기" : "승인하기"}</Button>
        </div>}
      </div>
    </form>
  </dialog>;
}
