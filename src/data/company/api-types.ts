export type DocumentUploadDto = {
  documentId: string;
  versionId: string;
  versionNumber: number;
  status: string;
  upload: { method: string; url: string; headers: Record<string, string>; expiresAt: string };
  sessionExpiresAt: string;
};

