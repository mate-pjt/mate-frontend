import { getDataConfig } from "../config";
import { getMockRuntime } from "../mock/runtime";
import { getHttpClient } from "../shared/client";
import type { CompanyRepository } from "./contracts";
import { createHttpCompanyRepository } from "./http-repository";
import { createMockCompanyRepository } from "./mock-repository";
export type * from "./contracts";
let repository: CompanyRepository | null = null;
function getRepository(): CompanyRepository { return repository ??= getDataConfig().sources.company === "mock" ? createMockCompanyRepository(getMockRuntime()) : createHttpCompanyRepository(getHttpClient()); }
export const searchCompanies: CompanyRepository["searchCompanies"] = (...args) => getRepository().searchCompanies(...args);
export const getMembershipContext: CompanyRepository["getMembershipContext"] = (...args) => getRepository().getMembershipContext(...args);
export const requestMembership: CompanyRepository["requestMembership"] = (...args) => getRepository().requestMembership(...args);
export const previewInvitation: CompanyRepository["previewInvitation"] = (...args) => getRepository().previewInvitation(...args);
export const resumeInvitation: CompanyRepository["resumeInvitation"] = (...args) => getRepository().resumeInvitation(...args);
export const acceptInvitation: CompanyRepository["acceptInvitation"] = (...args) => getRepository().acceptInvitation(...args);
export const declineInvitation: CompanyRepository["declineInvitation"] = (...args) => getRepository().declineInvitation(...args);
export const createBusinessConnection: CompanyRepository["createBusinessConnection"] = (...args) => getRepository().createBusinessConnection(...args);
export const getBusinessConnection: CompanyRepository["getBusinessConnection"] = (...args) => getRepository().getBusinessConnection(...args);
export const clearBusinessConnection: CompanyRepository["clearBusinessConnection"] = (...args) => getRepository().clearBusinessConnection(...args);
export const createUnverifiedCompany: CompanyRepository["createUnverifiedCompany"] = (...args) => getRepository().createUnverifiedCompany(...args);
export const createDocumentUpload: CompanyRepository["createDocumentUpload"] = (...args) => getRepository().createDocumentUpload(...args);
export const createDocumentVersion: CompanyRepository["createDocumentVersion"] = (...args) => getRepository().createDocumentVersion(...args);
export const retryDocumentProcessing: CompanyRepository["retryDocumentProcessing"] = (...args) => getRepository().retryDocumentProcessing(...args);
export const uploadDocumentFile: CompanyRepository["uploadDocumentFile"] = (...args) => getRepository().uploadDocumentFile(...args);
export const completeDocumentUpload: CompanyRepository["completeDocumentUpload"] = (...args) => getRepository().completeDocumentUpload(...args);
export const getDocumentProcessing: CompanyRepository["getDocumentProcessing"] = (...args) => getRepository().getDocumentProcessing(...args);
export const getRegistrationProposal: CompanyRepository["getRegistrationProposal"] = (...args) => getRepository().getRegistrationProposal(...args);
export const getIndustries: CompanyRepository["getIndustries"] = (...args) => getRepository().getIndustries(...args);
export const createVerifiedCompany: CompanyRepository["createVerifiedCompany"] = (...args) => getRepository().createVerifiedCompany(...args);
export const getMyCompanyOverview: CompanyRepository["getMyCompanyOverview"] = (...args) => getRepository().getMyCompanyOverview(...args);

export function documentStorageKey(accountId: number): string {
  return getDataConfig().sources.company === "api" ? `mate:signup-document:${accountId}` : getMockRuntime().store.key(String(accountId), "document-target");
}
