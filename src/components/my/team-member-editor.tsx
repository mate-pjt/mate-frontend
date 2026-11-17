"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { showToast } from "@/components/ui/toast";
import { getCompanyTeamPositions } from "@/data/company/client";
import { sameTeamPermissions, teamRoleFromPermissions, type TeamPosition } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { createTeamCommandScope, planTeamChange, teamChangePath, teamCommitToast, type TeamCommit, type TeamDetail, type TeamIntent } from "@/features/company/team-management";
import { teamRoleLabel } from "@/features/company/team";
import { TeamConfirmDialog } from "./team-confirm-dialog";

export function TeamMemberEditor({ snapshot, access, getSessionEpoch, onCommitted, onAccessError, reload, onNavigate }: {
  snapshot: TeamDetail; access: AuthAccess; getSessionEpoch: () => number; onCommitted: (value: TeamCommit) => void; onAccessError: (error: ApiError) => void; reload: () => void; onNavigate: () => void;
}) {
  const { member: m, current, catalog } = snapshot, c = m.capabilities, self = current.membershipId === m.membershipId;
  const [positions, setPositions] = useState<TeamPosition[] | null>(null), [positionId, setPositionId] = useState(m.positionId);
  const [permissions, setPermissions] = useState([...m.permissions]);
  const [message, setMessage] = useState("");
  const [validation, setValidation] = useState("");
  const [confirmation, setConfirmation] = useState<{ intent: TeamIntent; title: string; description: string } | null>(null);
  const [pending, setPending] = useState(false), [submitted, setSubmitted] = useState(false);
  const scope = useRef<ReturnType<typeof createTeamCommandScope> | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const epoch = useRef(getSessionEpoch());
  const { getAccessToken, getAccountKey, refresh } = access;
  useEffect(() => {
    const abort = new AbortController(), account = getAccountKey(), startedEpoch = epoch.current;
    void getCompanyTeamPositions({ getAccessToken, getAccountKey, refresh }, snapshot.companyId, abort.signal).then(value => {
      if (!abort.signal.aborted && startedEpoch === getSessionEpoch() && account === getAccountKey()) setPositions(value);
    }).catch(error => {
      if (!abort.signal.aborted && startedEpoch === getSessionEpoch() && account === getAccountKey()) setMessage(errorMessage(error));
    });
    return () => { abort.abort(); scope.current?.dispose(); };
  }, [getAccessToken, getAccountKey, refresh, getSessionEpoch, snapshot.companyId]);
  const editablePermissions = c.canChangePermissions || c.canRequestPermissionChange || c.canSelfDemote;
  const editablePosition = c.canChangePosition || c.canRequestPositionChange || c.canAppointSelfRepresentative || self && c.canSelfDemote && m.positionType === "REPRESENTATIVE";
  const blocked = pending || submitted || !positions || !!message;
  const viewer = catalog.presets.find(p => p.role === "VIEWER")!.permissionCodes;
  const selectedRole = teamRoleFromPermissions(catalog, permissions);
  function prepare(intent: TeamIntent) {
    if (!positions || blocked) return;
    try {
      const plan = planTeamChange(snapshot, positions, intent);
      const position = positions.find(p => p.id === plan.positionId);
      const names = plan.permissionCodes?.map(code => catalog.categories.flatMap(c => c.permissions).find(p => p.code === code)?.name ?? code);
      const description = `${plan.mode === "request" ? "대상이 명시적으로 수락해야 적용돼요. 무응답으로 자동 적용되거나 만료되지 않아요. " : "최신 권한·버전·마지막 관리자 조건을 다시 확인해요. "}${position ? `직급: ${m.positionName} → ${position.name}. ` : ""}${names ? `변경 후 전체 권한: ${names.join(", ")}. ` : ""}${plan.kind === "POSITION" && position?.type === "REPRESENTATIVE" ? "대표자 지정은 모든 관리자 권한을 포함해요. " : ""}${plan.mode === "leave" || plan.mode === "remove" || plan.kind === "REMOVE" ? "이 회사의 소속을 종료하며 서비스 계정을 삭제하지 않아요." : ""}`;
      setConfirmation({ intent: structuredClone(intent), title: plan.title, description });
    } catch (error) { setValidation(errorMessage(error)); }
  }
  async function confirm() {
    if (!confirmation || !positions || scope.current || pending) return;
    const active = createTeamCommandScope(access, () => epoch.current === getSessionEpoch()); scope.current = active;
    setPending(true); setSubmitted(true);
    try {
      const commit = await active.member(snapshot, positions, confirmation.intent);
      if (epoch.current !== getSessionEpoch()) return;
      // Close the connected native dialog before any parent refresh can unmount it.
      dialog.current?.close(); setConfirmation(null); onCommitted(commit); showToast(teamCommitToast(commit));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError" || epoch.current !== getSessionEpoch()) return;
      dialog.current?.close(); setConfirmation(null);
      if (error instanceof ApiError && [401, 403, 404].includes(error.status)) onAccessError(error);
      else setMessage(`${errorMessage(error)} 처리 완료로 확인된 것은 아니에요. 현재 상태만 다시 조회해 주세요.`);
    } finally { if (epoch.current === getSessionEpoch()) setPending(false); }
  }
  const positionOptions = (positions ?? [{ id: m.positionId, version: 1, name: m.positionName, type: m.positionType }]).map(p => ({ value: String(p.id), label: p.name,
    disabled: self ? p.type === "REPRESENTATIVE" ? !c.canAppointSelfRepresentative && p.id !== m.positionId : m.positionType !== "REPRESENTATIVE" && p.id !== m.positionId : p.type === "REPRESENTATIVE" && teamRoleFromPermissions(catalog, current.permissionCodes) !== "ADMIN" }));
  return <>
    <section className="mt-4 rounded-[20px] bg-white p-6 shadow-(--shadow-control)" aria-labelledby="team-position-title">
      <h2 id="team-position-title" className="mb-6 type-heading-9 text-grayscale-800">직급설정</h2>
      <p className="mb-2 type-body-7 text-grayscale-800">직급</p>
      <Select className="w-full" boxClassName="h-12 w-full justify-between" menuClassName="w-full max-h-64 overflow-y-auto" ariaLabel="변경할 직급" value={String(positionId)} options={positionOptions}
        disabled={!editablePosition || blocked} onValueChange={value => { setValidation(""); setPositionId(Number(value)); }} />
      <p className="mt-3 type-body-7 text-grayscale-600">{self ? "본인은 권한 축소·대표자 해제 또는 허용된 대표자 취임 경로를 사용해요." : c.canChangePosition ? "낮은 대상의 일반 직급은 직접 변경하며, 대표자 지정에는 대상 동의가 필요해요." : c.canRequestPositionChange ? "대상의 동의를 받은 뒤 직급을 변경해요." : "현재 직급을 변경할 수 없어요."}</p>
      {editablePosition && <Button className="mt-3" variant="outline" disabled={blocked || positionId === m.positionId} onClick={() => prepare({ action: "position", positionId })}>직급 변경하기</Button>}
      {m.positionType === "REPRESENTATIVE" && <p className="mt-3 type-body-7 text-primary-400">대표자 직급 정의는 수정·삭제할 수 없어요. 본인의 일반 직급 전환은 관리자 권한을 유지할 수 있고, 다른 관리자의 변경에는 대상 동의가 필요해요.</p>}
    </section>
    <section className="mt-4 rounded-[20px] bg-white p-6 shadow-(--shadow-control)" aria-labelledby="team-permissions-title">
      <h2 id="team-permissions-title" className="mb-6 type-heading-9 text-grayscale-800">역할설정</h2><p className="mb-2 type-body-7 text-grayscale-800">부여할 역할의 기본 권한</p>
      <div className="mb-4 grid grid-cols-3 gap-2" aria-label="역할 기본 권한 선택">{(["VIEWER", "AGENT", "ADMIN"] as const).map(role => {
        const codes = catalog.presets.find(p => p.role === role)!.permissionCodes;
        return <Button key={role} variant="outline" className={`bg-white ${selectedRole === role ? "outline-primary-400! text-primary-400!" : ""}`} aria-pressed={selectedRole === role}
          disabled={!editablePermissions || blocked || codes.some(code => !current.permissionCodes.includes(code)) || self && codes.some(code => !m.permissions.includes(code))}
          onClick={() => { setValidation(""); setPermissions([...codes]); }}>{teamRoleLabel(role)}</Button>;
      })}</div>
      <div className="space-y-3">{catalog.categories.map(category => <details key={category.code} open className="rounded-2xl bg-grayscale-50 p-4">
        <summary className="cursor-pointer rounded-lg py-2 type-body-5 text-grayscale-800 focus-visible:outline-2 focus-visible:outline-primary">{category.name} <span className="ml-1 type-body-7 text-primary-400">{category.permissions.filter(p => permissions.includes(p.code)).length}개의 권한을 선택했어요!</span></summary>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{category.permissions.map(p => <div className="flex items-start gap-2 rounded-lg bg-white p-4" key={p.code}>
          <CheckboxSquare checked={permissions.includes(p.code)} ariaLabel={p.name} disabled={!editablePermissions || blocked || viewer.includes(p.code) || !current.permissionCodes.includes(p.code) || self && !m.permissions.includes(p.code)}
            onCheckedChange={checked => { setValidation(""); setPermissions(value => checked ? [...value, p.code] : value.filter(code => code !== p.code)); }} />
          <div className="min-w-0"><p className="type-body-5 text-grayscale-800">{p.name}</p><p className="mt-1 type-body-7 text-grayscale-600">{p.description}</p></div>
        </div>)}</div>
      </details>)}</div>
      <p className="mt-4 type-body-7 text-grayscale-600">{editablePermissions ? "조회 기본 권한은 유지해요. 보유한 권한 안에서 선택하며 관리자 승격·동급 대상 변경은 명시 동의 후 적용돼요." : "현재 권한을 변경할 수 없어요."}</p>
      {validation && <p className="mt-4 type-body-7 text-danger" role="alert">{validation}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-2"><ButtonLink href={teamChangePath()} variant="tertiary" onNavigate={onNavigate}>변경 요청 확인하기</ButtonLink>
        <Button disabled={!editablePermissions || blocked || sameTeamPermissions(permissions, m.permissions) && !(self && positionId !== m.positionId)} onClick={() => prepare({ action: "permissions", permissionCodes: permissions, positionId })}>권한 저장하기</Button></div>
      <div className="mt-6 flex flex-wrap gap-3 border-t border-grayscale-200 pt-4">
        {(c.canRemove || c.canRequestRemoval) && <Button variant="text_gray" disabled={blocked} onClick={() => prepare({ action: "remove" })}>{c.canRequestRemoval && !c.canRemove ? "내보내기 동의 요청" : "팀원 내보내기"}</Button>}
        {c.canLeave && <Button variant="text_gray" disabled={blocked} onClick={() => prepare({ action: "leave" })}>회사 소속 종료하기</Button>}
      </div>
    </section>
    {message && <div className="mt-4 rounded-2xl bg-grayscale-50 p-4" role="alert"><p className="type-body-5 text-danger">{message}</p><Button className="mt-3" variant="outline" onClick={reload}>현재 상태 다시 조회하기</Button></div>}
    <TeamConfirmDialog dialogRef={dialog} open={!!confirmation} pending={pending} title={confirmation?.title ?? "변경 확인"} description={confirmation?.description ?? ""} onClose={() => setConfirmation(null)} onConfirm={() => void confirm()} />
  </>;
}
