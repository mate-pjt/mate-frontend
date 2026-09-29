"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { CompanyEvidencePanel, CompanyIdentityPanel, RegistrationFinished, RegistrationPreferences } from "@/components/auth/company-registration";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { ApiError, errorMessage } from "@/features/auth/api";
import {
  completeDocumentUpload,
  createDocumentUpload,
  createDocumentVersion,
  createVerifiedCompany,
  getDocumentProcessing,
  getIndustries,
  getRegistrationProposal,
  retryDocumentProcessing,
  uploadDocumentFile,
} from "@/features/auth/onboarding-api";
import { useAuthSession } from "@/features/auth/session";
import type { BidAmountRange, CompanyRegistrationProposal, DocumentProcessing } from "@/features/auth/types";

const acceptedFileTypes: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };
type Step = "upload" | "processing" | "processing-failed" | "identity" | "evidence" | "preferences" | "verified" | "done";
type DocumentTarget = { documentId: string; versionId: string };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const documentStorageKey = (accountId: number) => `mate:signup-document:${accountId}`;

export function DocumentRegistration() {
  const session = useAuthSession();
  const access = useMemo(() => ({ getAccessToken: session.getAccessToken, refresh: session.refresh }), [session.getAccessToken, session.refresh]);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadKey = useRef<{ signature: string; key: string } | null>(null);
  const retryKey = useRef<string | null>(null);
  const registerKey = useRef<{ payload: string; key: string } | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<DocumentTarget | null>(null);
  const [processing, setProcessing] = useState<DocumentProcessing | null>(null);
  const [proposal, setProposal] = useState<CompanyRegistrationProposal | null>(null);
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [industryQuery, setIndustryQuery] = useState("");
  const [industries, setIndustries] = useState<Array<{ code: string; name: string }>>([]);
  const [industry, setIndustry] = useState<{ code: string; name: string } | null>(null);
  const [conflictChoice, setConflictChoice] = useState<"REUSE_EXISTING" | "CREATE_NEW_VERIFIED" | null>(null);
  const [correctNumber, setCorrectNumber] = useState(false);
  const [representative, setRepresentative] = useState<boolean | null>(null);
  const [positionName, setPositionName] = useState("");
  const [amountRange, setAmountRange] = useState<BidAmountRange | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneWarning, setDoneWarning] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);
  const accountId = session.state.status === "authenticated" ? session.state.authentication.account.id : null;

  useEffect(() => {
    if (accountId === null) return;
    let active = true;
    const key = documentStorageKey(accountId);
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = window.sessionStorage.getItem(key);
        if (saved) {
          const value = JSON.parse(saved) as Partial<DocumentTarget>;
          if (value && uuidPattern.test(value.documentId ?? "") && uuidPattern.test(value.versionId ?? "")) {
            setTarget({ documentId: value.documentId!, versionId: value.versionId! });
            setStep("processing");
          } else {
            window.sessionStorage.removeItem(key);
          }
        }
      } catch {
        // Storage can be unavailable; the current page still supports a fresh upload.
      }
      setRestoring(false);
    });
    return () => { active = false; };
  }, [accountId]);

  function chooseFile(nextFile: File | null) {
    if (!nextFile) return;
    const extension = nextFile.name.split(".").at(-1)?.toLowerCase() ?? "";
    if (acceptedFileTypes[extension] !== nextFile.type || nextFile.size < 1 || nextFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setError("PDF, JPG, PNG 파일만 업로드할 수 있습니다. 파일 크기는 10MB 이하로 선택해 주세요.");
      return;
    }
    setFile(nextFile);
    setError(null);
    uploadKey.current = null;
    retryKey.current = null;
  }

  useEffect(() => {
    const currentAccountId = accountId;
    if (step !== "processing" || !target || currentAccountId === null) return;
    let active = true;
    let timer: number | undefined;
    async function poll() {
      if (!target) return;
      try {
        const value = await getDocumentProcessing(access, target.documentId);
        if (!active) return;
        setProcessing(value);
        if (value.status === "VERIFIED") {
          if (currentAccountId !== null) {
            try { window.sessionStorage.removeItem(documentStorageKey(currentAccountId)); } catch { /* Storage may be unavailable. */ }
          }
          setStep("verified");
          return;
        }
        if (value.status === "COMPANY_CONFIRMATION_REQUIRED" && value.proposalId) {
          try {
            const next = await getRegistrationProposal(access, value.proposalId);
            if (!active) return;
            setProposal(next);
            setTelephoneNumber(next.telephoneNumber ?? "");
            setIndustry(next.primaryIndustry);
            setConflictChoice(null);
            setCorrectNumber(false);
            setIndustries([]);
            setStep("identity");
            return;
          } catch (reason) {
            if (!active) return;
            if (reason instanceof ApiError && reason.code === "COMPANY_ALREADY_VERIFIED") {
              if (currentAccountId !== null) {
                try { window.sessionStorage.removeItem(documentStorageKey(currentAccountId)); } catch { /* Storage may be unavailable. */ }
              }
              setStep("verified");
              return;
            }
            setError(errorMessage(reason));
            setStep("processing-failed");
            return;
          }
        }
        if (value.status === "COMPANY_CONFIRMATION_REQUIRED" && !value.proposalId) {
          setError("회사 등록 정보를 찾지 못했습니다. 상태를 다시 확인해 주세요.");
          setStep("processing-failed");
          return;
        }
        if (["OCR_FAILED", "VERIFICATION_FAILED", "VERIFICATION_REJECTED", "REUPLOAD_REQUIRED", "DELETED", "PURGED", "REPLACED"].includes(value.status)) {
          setStep("processing-failed");
          return;
        }
        timer = window.setTimeout(() => { void poll(); }, 1000);
      } catch (reason) {
        if (!active) return;
        setError(errorMessage(reason));
        setStep("processing-failed");
      }
    }
    void poll();
    return () => { active = false; window.clearTimeout(timer); };
  }, [access, accountId, step, target]);

  async function upload() {
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    try {
      const signature = `${target?.documentId ?? "new"}:${target?.versionId ?? "new"}:${file.name}:${file.size}:${file.lastModified}`;
      if (uploadKey.current?.signature !== signature) uploadKey.current = { signature, key: crypto.randomUUID() };
      const uploadSession = target
        ? await createDocumentVersion(access, target.documentId, target.versionId, file, uploadKey.current.key)
        : await createDocumentUpload(access, file, uploadKey.current.key);
      await uploadDocumentFile(uploadSession.upload, file);
      await completeDocumentUpload(access, uploadSession.documentId, uploadSession.versionId);
      const nextTarget = { documentId: uploadSession.documentId, versionId: uploadSession.versionId };
      if (accountId !== null) {
        try { window.sessionStorage.setItem(documentStorageKey(accountId), JSON.stringify(nextTarget)); } catch { /* Storage may be unavailable. */ }
      }
      setTarget(nextTarget);
      retryKey.current = null;
      setProcessing(null);
      setStep("processing");
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  async function retry() {
    if (!target || busy) return;
    if (!processing || processing.status === "COMPANY_CONFIRMATION_REQUIRED") {
      setError(null);
      setStep("processing");
      return;
    }
    if (!processing.canRetry) {
      setStep("upload");
      setFile(null);
      return;
    }
    const kind = processing.status === "OCR_FAILED" ? "ocr" : "verification";
    setBusy(true);
    setError(null);
    try {
      retryKey.current ??= crypto.randomUUID();
      await retryDocumentProcessing(access, target.documentId, target.versionId, kind, retryKey.current);
      retryKey.current = null;
      setStep("processing");
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  async function searchIndustries(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try { setIndustries(await getIndustries(industryQuery.trim())); }
    catch (reason) { setError(errorMessage(reason)); }
    finally { setBusy(false); }
  }

  async function register() {
    if (!proposal || !industry || representative === null || !amountRange || busy) return;
    if (!representative && !positionName.trim()) {
      setError("직급을 입력해 주세요.");
      return;
    }
    if (proposal.conflict?.decisionRequired && !conflictChoice) {
      setError("기존 회사 처리 방법을 선택해 주세요.");
      setStep("identity");
      return;
    }
    if (proposal.businessNumberCorrection?.decisionRequired && !correctNumber) {
      setError("사업자번호 정정 여부를 확인해 주세요.");
      setStep("identity");
      return;
    }
    const body = {
      proposalId: proposal.proposalId,
      documentId: proposal.documentId,
      versionId: proposal.versionId,
      revision: proposal.revision,
      telephoneNumber: telephoneNumber.trim() || null,
      primaryIndustryCode: industry.code,
      preferredBidNoticeAmountRange: amountRange,
      representative,
      positionName: representative ? null : positionName.trim(),
      conflictChoice,
      businessNumberCorrectionChoice: correctNumber ? "CORRECT_CURRENT_UNVERIFIED" as const : null,
    };
    const payload = JSON.stringify(body);
    setBusy(true);
    setError(null);
    try {
      if (registerKey.current?.payload !== payload) registerKey.current = { payload, key: crypto.randomUUID() };
      const result = await createVerifiedCompany(access, body, registerKey.current.key);
      if (accountId !== null) {
        try { window.sessionStorage.removeItem(documentStorageKey(accountId)); } catch { /* Storage may be unavailable. */ }
      }
      setDoneWarning(result.conflict ? "기존 회사와의 합치기 제안은 별도 검토를 거쳐 처리됩니다." : null);
      setStep("done");
      try { await access.refresh(); }
      catch { setDoneWarning("회사 등록은 완료됐지만 로그인 상태를 갱신하지 못했습니다. 새로고침 후 확인해 주세요."); }
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  const profile = proposal?.companyProfile;
  const identityReady = Boolean(industry && (!proposal?.conflict?.decisionRequired || conflictChoice) && (!proposal?.businessNumberCorrection?.decisionRequired || correctNumber));
  const backStep = step === "identity" ? "upload" : step === "evidence" ? "identity" : "evidence";

  return (
    <AuthGate>
      <AuthCard>
        {restoring ? <p className="text-grayscale-700 type-body-3" role="status">이전 증명서 처리 상태를 확인하고 있어요.</p> : null}
        {step === "upload" || step === "processing" || step === "processing-failed" || step === "verified" ? <AuthBack href="/auth/company/register" /> : null}
        {step === "identity" || step === "evidence" || step === "preferences" ? (
          <button className="mb-6 text-grayscale-600 type-body-3" onClick={() => setStep(backStep)} type="button">← 뒤로가기</button>
        ) : null}
        {step === "upload" && !restoring ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">사업자등록증명서 한 장만 올리면<br />회사 정보와 실적까지 한 번에 채워줘요!</h1>
            <p className="flex items-center gap-2 rounded-xl bg-primary-100 p-5 text-primary type-body-7"><Image src="/images/auth/info.png" alt="" width={20} height={20} />최근 30일 이내에 정부24에서 발급받은 사업자등록증명서를 올려주세요!</p>
            <div
              className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-grayscale-200 bg-grayscale-50 p-6 text-center"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0] ?? null); }}
            >
              <div><p className="font-semibold text-grayscale-800 type-body-7">파일을 여기에 끌어다 놓거나<br />클릭하여 선택해주세요!</p><p className="mt-2 text-grayscale-600 type-body-7">PDF, JPG, PNG 파일만 업로드 가능 (최대 10MB)</p></div>
              <input accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} ref={inputRef} type="file" />
              <Button onClick={() => inputRef.current?.click()} type="button">파일 선택</Button>
              {file ? <p className="break-all text-grayscale-800 type-body-7">선택한 파일: {file.name}</p> : null}
            </div>
            <div className="rounded-xl bg-grayscale-50 p-5 text-grayscale-700 type-body-7">
              <p className="flex items-center gap-2 font-semibold"><Image src="/icon/24dp/important.svg" alt="" width={20} height={20} />확인해주세요!</p>
              <ul className="mt-3 space-y-2">
                {["최근에 발급받은 서류인가요?", "서류의 모든 면이 다 보이나요?", "글자가 흐릿하지 않고 선명한가요?", "가급적 스캔한 PDF 파일을 추천드려요."].map((item) => (
                  <li className="flex items-start gap-2" key={item}><Image src="/icon/24dp/state.svg" alt="" width={16} height={16} />{item}</li>
                ))}
              </ul>
            </div>
            <Button className="h-14 w-full" disabled={!file || busy} onClick={() => void upload()}>{busy ? "업로드하고 있어요..." : "정보 불러오기"}</Button>
          </div>
        ) : null}
        {step === "processing" ? (
          <div className="space-y-5 text-center" role="status">
            <h1 className="text-grayscale-800 type-heading-7">회사 정보를 불러오고 있어요!</h1>
            <p className="text-grayscale-600 type-body-3">증명서를 읽고 사업자 정보와 공개 실적을 확인하고 있어요.</p>
            <p className="rounded-xl bg-primary-100 p-5 text-primary type-body-7">{processing?.status ?? "OCR_PENDING"}</p>
          </div>
        ) : null}
        {step === "processing-failed" ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">증명서를 확인하지 못했어요.</h1>
            <p className="text-grayscale-600 type-body-7">{processing?.failureCode ? `오류 코드: ${processing.failureCode}` : "다시 시도하거나 선명한 서류를 선택해 주세요."}</p>
            <Button className="h-14 w-full" disabled={busy} onClick={() => void retry()}>{!processing || processing.status === "COMPANY_CONFIRMATION_REQUIRED" ? "상태 다시 확인하기" : processing.canRetry ? "확인 다시 시도하기" : "새 파일 선택하기"}</Button>
          </div>
        ) : null}
        {step === "verified" ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">이미 인증된 회사 정보가 있어요!</h1>
            <p className="text-grayscale-600 type-body-7">서류 검증이 완료된 회사로 통합 요청이 필요해요.</p>
            <Link className="block rounded-lg bg-primary px-5 py-4 text-center text-white" href={`/auth/company/search?query=${encodeURIComponent(processing?.extractedFields?.businessNumber ?? "")}`}>팀원으로 합류하기</Link>
          </div>
        ) : null}
        {step === "identity" && proposal && profile ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">확인한 회사 정보예요.<br />{proposal.companyName} 회사가 맞으신가요?</h1>
            <CompanyIdentityPanel profile={profile} />
            <label className="block text-grayscale-800 type-body-7">전화번호(선택)<TextInput className="mt-2 w-full" maxLength={30} onValueChange={setTelephoneNumber} placeholder="회사 전화번호를 입력해 주세요." value={telephoneNumber} /></label>
            {proposal.primaryIndustrySelectionRequired || !industry ? (
              <div className="space-y-3 rounded-xl border border-grayscale-200 p-4">
                <p className="text-grayscale-800 type-body-1">주력업종을 선택해 주세요.</p>
                <form className="flex gap-2" onSubmit={(event) => void searchIndustries(event)}>
                  <TextInput className="min-w-0 flex-1" onValueChange={setIndustryQuery} placeholder="업종명 검색" value={industryQuery} />
                  <Button disabled={busy} type="submit">검색</Button>
                </form>
                {industry ? <p className="text-primary type-body-7">선택: {industry.name} ({industry.code})</p> : null}
                {industries.length ? <div className="max-h-36 overflow-auto border-t border-grayscale-200 pt-2">{industries.map((item) => <button className="block w-full px-2 py-2 text-left text-grayscale-700 type-body-7 hover:bg-grayscale-50" key={item.code} onClick={() => setIndustry(item)} type="button">{item.name} ({item.code})</button>)}</div> : null}
              </div>
            ) : null}
            {proposal.conflict ? (
              <fieldset className="space-y-3 rounded-xl bg-primary-100 p-4">
                <legend className="text-grayscale-800 type-body-1">동일 사업자번호의 미인증 회사: {proposal.conflict.existingCompanyName}</legend>
                {proposal.conflict.allowedChoices.includes("REUSE_EXISTING") ? (
                  <label className="flex gap-2 text-grayscale-700 type-body-7"><input checked={conflictChoice === "REUSE_EXISTING"} onChange={() => setConflictChoice("REUSE_EXISTING")} type="radio" />{proposal.conflict.reuseMode === "VERIFY_CURRENT_COMPANY" ? "현재 회사를 인증하기" : "새 인증 회사를 등록하고 기존 회사에 합치기를 제안하기"}</label>
                ) : null}
                {proposal.conflict.allowedChoices.includes("CREATE_NEW_VERIFIED") ? (
                  <label className="flex gap-2 text-grayscale-700 type-body-7"><input checked={conflictChoice === "CREATE_NEW_VERIFIED"} onChange={() => setConflictChoice("CREATE_NEW_VERIFIED")} type="radio" />기존 미인증 회사와 별개로 새 인증 회사 등록하기</label>
                ) : null}
                {!proposal.conflict.allowedChoices.length ? <p className="text-danger type-body-7">현재 계정에서는 회사 등록을 진행할 수 없습니다.</p> : null}
              </fieldset>
            ) : null}
            {proposal.businessNumberCorrection ? (
              <label className="flex items-start gap-2 rounded-xl bg-primary-100 p-4 text-grayscale-700 type-body-7">
                <input checked={correctNumber} className="mt-1" onChange={(event) => setCorrectNumber(event.target.checked)} type="checkbox" />
                현재 미인증 회사의 사업자번호를 {proposal.businessNumberCorrection.currentBusinessNumber}에서 {proposal.businessNumberCorrection.certificateBusinessNumber}(으)로 정정하는 데 동의합니다.
              </label>
            ) : null}
            <Button className="h-14 w-full" disabled={!identityReady} onClick={() => setStep("evidence")}>다음</Button>
          </div>
        ) : null}
        {step === "evidence" && profile ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">불러온 회사 정보와 실적이<br />모두 맞나요?</h1>
            <CompanyEvidencePanel onNext={() => setStep("preferences")} profile={profile} />
          </div>
        ) : null}
        {step === "preferences" ? (
          <div className="space-y-6">
            <h1 className="text-grayscale-800 type-heading-7">몇 가지만 확인할까요?<br />이제 마지막이에요!</h1>
            <RegistrationPreferences amountRange={amountRange} onAmountRangeChange={setAmountRange} onPositionNameChange={setPositionName} onRepresentativeChange={setRepresentative} positionName={positionName} representative={representative} />
            <Button className="h-14 w-full" disabled={busy || representative === null || !amountRange || (representative === false && !positionName.trim())} onClick={() => void register()}>{busy ? "등록하고 있어요..." : "메이트 시작하기"}</Button>
          </div>
        ) : null}
        {step === "done" ? <RegistrationFinished verified warning={doneWarning} /> : null}
        <div className="mt-4"><AuthError message={error} /></div>
      </AuthCard>
    </AuthGate>
  );
}
