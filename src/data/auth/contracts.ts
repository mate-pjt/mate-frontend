export type AgreementCode = "TERMS_OF_SERVICE" | "PRIVACY_POLICY";

export type RequiredAgreement = {
  code: AgreementCode;
  version: string;
  title: string;
};

export type SocialSignup = {
  verifiedEmail: string;
  suggestedName: string | null;
  profileImageUrl: string | null;
  expiresAt: string;
  requiredAgreements: RequiredAgreement[];
};

export type Authentication = {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  account: { id: number; email: string };
  companyContext: { companyId: number; role: string } | null;
  companyOnboarding: {
    status: "NOT_STARTED" | "COMPLETED";
    availableActions: Array<"START_NOW" | "FIND_COMPANY" | "REGISTER_COMPANY">;
  };
};

export type CompleteSignup = {
  name: string;
  birthDate: string | null;
  mobilePhone: string | null;
  agreementAcceptances: Array<{ code: AgreementCode; version: string }>;
};


export type LoginChoice = "existing" | "signup" | "alternate";

export interface AuthRepository {
  googleAuthorizationUrl(returnTo: string, returnOrigin: string, choice?: LoginChoice): string;
  completeGoogleSession(flowId: string): Promise<Authentication>;
  getCurrentSocialSignup(flowId: string): Promise<SocialSignup>;
  completeSocialSignup(flowId: string, input: CompleteSignup): Promise<Authentication>;
  refreshBrowserSession(): Promise<Authentication>;
  logoutBrowserSession(): Promise<void>;
}
