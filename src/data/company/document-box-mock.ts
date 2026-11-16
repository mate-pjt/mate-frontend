import type { DocumentBoxVersion, DocumentVersionStatus } from "./contracts";

export type MockDocumentBox = { companyId: number | null; currentVersionId: string | null; versions: Record<string, DocumentBoxVersion> };

export function mockDocumentVersion(versionId: string, versionNumber: number, status: DocumentVersionStatus, now: number): DocumentBoxVersion {
  return { versionId, versionNumber, status, current: false, filename: "합성 사업자등록증명서.pdf", uploadedAt: new Date(now).toISOString(), modifiedAt: new Date(now).toISOString(), validFrom: null, validUntil: null };
}

export function documentBoxFixtures(now: number): Array<{ documentId: string; box: MockDocumentBox; displayedVersionId: string }> {
  const day = (offset: number) => new Date(now + 9 * 3_600_000 + offset * 86_400_000).toISOString().slice(0, 10);
  const statuses: DocumentVersionStatus[] = ["VERIFIED", "OCR_PROCESSING", "OCR_FAILED", "UPLOAD_READY", "OCR_SUCCEEDED", "VERIFICATION_PENDING", "VERIFICATION_FAILED", "VERIFICATION_REJECTED", "COMPANY_CONFIRMATION_REQUIRED", "REUPLOAD_REQUIRED"];
  return Array.from({ length: 25 }, (_, i) => {
    const documentId = `10000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;
    const currentId = `20000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;
    const current = mockDocumentVersion(currentId, 1, "VERIFIED", now - i * 60_000);
    current.current = true;
    current.validUntil = i === 0 ? day(0) : i === 2 ? day(-1) : null;
    if (i === 3) { current.validFrom = day(1); current.validUntil = day(30); }
    if (i === 4) current.validUntil = "2030-02-30";
    const versions = { [currentId]: current };
    let displayedVersionId = currentId;
    if (i > 0 && i < statuses.length) {
      const candidateId = `30000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;
      const candidate = mockDocumentVersion(candidateId, 2, statuses[i], now - i * 60_000);
      versions[candidateId] = candidate;
      displayedVersionId = candidateId;
    }
    return { documentId, displayedVersionId, box: { companyId: 7001, currentVersionId: currentId, versions } };
  });
}
