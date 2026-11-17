"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox";
import { TextInput } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { TeamInvitation, TeamInvitationInput, TeamRole } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { createTeamInvitationScope, planTeamInvitation, teamInvitationDeliveryLabel, teamInvitationStatus, type TeamInvitationSnapshot } from "@/features/company/team-invitations";
import { teamDate, teamRoleLabel } from "@/features/company/team";

export function TeamInvitationDialog({ snapshot, access, getSessionEpoch, detail, onClose, onCommitted, onAccessError }: {
  snapshot: TeamInvitationSnapshot; access: AuthAccess; getSessionEpoch: () => number; detail?: TeamInvitation;
  onClose: () => void; onCommitted: (value: TeamInvitation) => void; onAccessError: (error: ApiError) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null), active = useRef<ReturnType<typeof createTeamInvitationScope> | null>(null);
  const fieldId = useId();
  const live = useRef(false), epoch = useRef(getSessionEpoch());
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [representative, setRepresentative] = useState(false);
  const [position, setPosition] = useState(""), [proposed, setProposed] = useState(""), [preset, setPreset] = useState<TeamRole>("VIEWER");
  const [extras, setExtras] = useState<string[]>([]), [message, setMessage] = useState("");
  const [pending, setPending] = useState(false), [submitted, setSubmitted] = useState(false), [error, setError] = useState("");
  const { catalog, current, page } = snapshot, c = page.capabilities;
  const base = catalog.presets.find(p => p.role === preset)!.permissionCodes;
  const selected = representative ? catalog.presets.find(p => p.role === "ADMIN")!.permissionCodes : [...new Set([...base, ...extras])];
  const canManage = c.canManagePermissions && current.permissionCodes.includes("COMPANY_MEMBER_PERMISSION_MANAGE");
  const body: TeamInvitationInput = { email, inviteeDisplayName: name, representative, positionId: representative || position === "new" || !position ? null : Number(position),
    proposedPositionName: representative || position !== "new" ? null : proposed, preset: representative ? null : preset, extraPermissionCodes: representative ? [] : extras.filter(code => !base.includes(code)), message: message || null };
  let valid = false, validation = "";
  try { planTeamInvitation(snapshot, body); valid = true; } catch (reason) { validation = errorMessage(reason); }

  useEffect(() => {
    live.current = true; const element = dialog.current;
    element?.showModal();
    return () => { live.current = false; active.current?.dispose(); element?.close(); };
  }, []);
  function close() { if (pending) return; dialog.current?.close(); onClose(); }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (detail || pending || submitted || active.current) return;
    try { planTeamInvitation(snapshot, body); } catch (reason) { setError(errorMessage(reason)); return; }
    const scope = createTeamInvitationScope(access, () => live.current && epoch.current === getSessionEpoch()); active.current = scope;
    setPending(true); setSubmitted(true); setError("");
    try {
      const result = await scope.submit(snapshot, body);
      if (!live.current || epoch.current !== getSessionEpoch()) return;
      dialog.current?.close(); onCommitted(result);
    } catch (reason) {
      if (!live.current || epoch.current !== getSessionEpoch() || reason instanceof DOMException && reason.name === "AbortError") return;
      if (reason instanceof ApiError && [401, 403, 404].includes(reason.status)) { dialog.current?.close(); onAccessError(reason); return; }
      setError(`${errorMessage(reason)} 초대 완료로 확인된 것은 아니에요. 닫고 보낸 초대 상태부터 다시 확인해 주세요.`);
    } finally { if (live.current && epoch.current === getSessionEpoch()) setPending(false); }
  }
  const title = detail ? "보낸 초대 정보" : "초대할 팀원의 정보와 권한을 설정해 주세요!";
  return <dialog ref={dialog} aria-label={title} aria-busy={pending} onCancel={event => { event.preventDefault(); close(); }}
    className="m-auto max-h-[min(908px,90dvh)] w-[calc(100vw-2rem)] max-w-[640px] overflow-y-auto rounded-[20px] border border-grayscale-200 bg-white p-0 text-grayscale-800 shadow-(--shadow-floating) backdrop:bg-grayscale-900/30">
    <form onSubmit={submit}>
      <div className="p-6 pb-0">
        <div className="flex justify-end"><button type="button" aria-label="초대 창 닫기" disabled={pending} onClick={close} className="inline-flex size-6 items-center justify-center disabled:opacity-40"><CloseIcon className="size-6" /></button></div>
        <h2 className="mt-2 mb-6 type-heading-7">{detail ? title : <>초대할 팀원의<br />정보와 권한을 설정해 주세요!</>}</h2>
        {detail ? <InvitationDetail value={detail} snapshot={snapshot} /> : <fieldset disabled={pending || submitted} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 type-body-3"><label htmlFor={`${fieldId}-name`}>팀원명</label><TextInput id={`${fieldId}-name`} className="w-full!" value={name} onValueChange={setName} maxLength={100} placeholder="초대할 팀원명을 입력해 주세요." autoComplete="off" /></div>
            <div className="flex flex-col gap-2 type-body-3"><label htmlFor={`${fieldId}-email`}>이메일</label><TextInput id={`${fieldId}-email`} className="w-full!" type="email" value={email} onValueChange={setEmail} maxLength={254} placeholder="초대할 팀원의 이메일을 입력해 주세요." autoComplete="off" /></div>
            <fieldset className="space-y-2"><legend className="mb-2 type-body-3">대표자 여부</legend><div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" className={`h-12 bg-white! ${!representative ? "outline-primary-400! text-primary-400!" : ""}`} aria-pressed={!representative} onClick={() => setRepresentative(false)}>팀원</Button>
              <Button type="button" variant="outline" className={`h-12 bg-white! ${representative ? "outline-primary-400! text-primary-400!" : ""}`} aria-pressed={representative} onClick={() => setRepresentative(true)} disabled={!c.canInviteRepresentative}
                title={!c.canInviteRepresentative ? "관리자이며 대표자가 없는 회사에서만 초대할 수 있어요." : undefined}>대표자</Button>
            </div><div className="flex items-start gap-1 rounded-xl bg-grayscale-50 px-4 py-6 type-body-6 text-grayscale-700"><Image src="/icon/24dp/important.svg" alt="" width={20} height={20} />대표자 초대는 관리자이며 대표자가 없는 회사에서만 보낼 수 있어요.</div></fieldset>
            {!representative && <div className="flex flex-col gap-2"><label className="type-body-3" id="invite-position-label">부여할 직급</label>
              <Select ariaLabel="부여할 직급" className="w-full" boxClassName={`h-12! w-full! justify-between! font-medium! ${!position ? "text-grayscale-500!" : ""}`} value={position} onValueChange={setPosition} placeholder="초대할 팀원의 직급을 선택해 주세요."
                disabled={pending || submitted} options={[...snapshot.positions.filter(p => p.type === "CUSTOM").map(p => ({ value: String(p.id), label: p.name })), ...(c.canEditPosition && current.permissionCodes.includes("COMPANY_MEMBER_PROFILE_EDIT") ? [{ value: "new", label: "새 직급명 입력" }] : [])]} />
              {position === "new" && <div className="flex flex-col gap-2 type-body-7"><label htmlFor={`${fieldId}-position`}>새 직급명</label><TextInput id={`${fieldId}-position`} className="w-full!" value={proposed} onValueChange={setProposed} maxLength={30} placeholder="새 일반 직급명을 입력해 주세요." /></div>}
            </div>}
          </div>
          {!representative && <div className="space-y-4 border-t border-grayscale-200 pt-6">
            <fieldset><legend className="mb-2 type-body-3">부여할 역할</legend><div className="grid grid-cols-3 gap-2">{(["VIEWER", "AGENT", "ADMIN"] as const).map(role => {
              const available = catalog.presets.find(p => p.role === role)!.permissionCodes.every(code => current.permissionCodes.includes(code)) && (role === "VIEWER" || canManage);
              return <Button type="button" key={role} variant="outline" className={`h-12 bg-white! ${preset === role ? "outline-primary-400! text-primary-400!" : ""}`} aria-pressed={preset === role} disabled={!available} onClick={() => { setPreset(role); setExtras([]); }}>{teamRoleLabel(role)}</Button>;
            })}</div></fieldset>
            {catalog.categories.map(category => <details className="rounded-lg bg-grayscale-50 p-4" key={category.code}>
              <summary className="cursor-pointer type-body-1 text-grayscale-700">{category.name} 권한 <span className="ml-2 type-body-7 text-primary-400">{category.permissions.filter(p => selected.includes(p.code)).length}개의 권한을 선택했어요!</span></summary>
              <div className="mt-4 space-y-3">{category.permissions.map(permission => <label className="flex items-start gap-2 type-body-7" key={permission.code}>
                <CheckboxSquare checked={selected.includes(permission.code)} disabled={pending || submitted || !canManage || base.includes(permission.code) || !current.permissionCodes.includes(permission.code)}
                  ariaLabel={permission.name} onCheckedChange={checked => setExtras(values => checked ? [...new Set([...values, permission.code])] : values.filter(v => v !== permission.code))} />
                <span>{permission.name}<span className="mt-1 block text-grayscale-600">{permission.description}</span></span>
              </label>)}</div>
            </details>)}
          </div>}
          <div className="flex flex-col gap-2 type-body-3"><label htmlFor={`${fieldId}-message`}>메시지 (선택)</label><TextInput id={`${fieldId}-message`} className="w-full!" value={message} onValueChange={setMessage} maxLength={500} placeholder="초대 메시지를 500자 이내로 입력해 주세요." /></div>
          <p className="type-body-7 text-grayscale-600">이미 등록된 계정은 등록된 이름으로 표시돼요. 초대 생성과 메일 전송·상대방 수락은 각각 확인해 주세요.</p>
          {!valid && (name || email || position) && <p className="type-body-7 text-danger-emphasis" role="status">{validation}</p>}
        </fieldset>}
        {error && <div className="mt-4 rounded-xl bg-grayscale-50 p-4 type-body-7 text-danger-emphasis" role="alert">{error}</div>}
      </div>
      <div className="sticky bottom-0 bg-white p-6">
        {detail || submitted && !pending ? <Button type="button" className="w-full!" size="xxl" onClick={close}>{detail ? "확인" : "닫고 초대 상태 확인하기"}</Button>
          : <Button type="submit" className="w-full!" size="xxl" disabled={!valid || pending}>{pending ? "초대 요청 중…" : "팀원 초대하기"}</Button>}
      </div>
    </form>
  </dialog>;
}

function InvitationDetail({ value: v, snapshot }: { value: TeamInvitation; snapshot: TeamInvitationSnapshot }) {
  const fields = [["팀원명", v.inviteeDisplayName], ["이메일", v.invitedEmail], ["직급", v.position?.name ?? "직급 미제공"], ["역할", teamRoleLabel(v.role)],
    ["초대 상태", teamInvitationStatus(v)], ["메일 전송 상태", teamInvitationDeliveryLabel(v.delivery.status)], ["초대일", teamDate(v.createdAt, true)],
    ["만료일", teamDate(v.expiresAt, true)], ["마지막 변경", teamDate(v.updatedAt, true)], ["처리일", v.completedAt ? teamDate(v.completedAt, true) : "미처리"], ["메시지", v.message || "없음"]];
  return <div className="space-y-6"><dl className="space-y-4">{fields.map(([label, value]) => <div key={label}><dt className="mb-1 type-body-7 text-grayscale-600">{label}</dt><dd className="break-all type-body-3">{value}</dd></div>)}</dl>
    <div><h3 className="mb-2 type-body-1">부여한 권한</h3><ul className="space-y-1 type-body-7">{v.permissions.map(code => <li key={code}>{snapshot.catalog.categories.flatMap(c => c.permissions).find(p => p.code === code)!.name}</li>)}</ul></div>
    <p className="type-body-7 text-grayscale-600">메일 전송 처리 완료는 수신함 도착이나 초대 수락을 보장하지 않아요.</p>
  </div>;
}
