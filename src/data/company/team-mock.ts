import { ApiError } from "../shared/errors";
import type { AuthAccess } from "../shared/http";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import type { CompanyPermissionCatalog, CompanyTeamMember, CompanyTeamRepository, TeamMemberCapabilities, TeamRole } from "./team-contracts";
import { validateTeamMemberId, validateTeamQuery } from "./team-api";

const categories: CompanyPermissionCatalog["categories"] = [
  {
    "code": "COMPANY_INFORMATION",
    "name": "회사 정보",
    "permissions": [
      {
        "code": "COMPANY_INFORMATION_VIEW",
        "name": "회사 정보 조회",
        "description": "회사 기본 정보와 인증 상태를 조회합니다."
      },
      {
        "code": "COMPANY_INFORMATION_EDIT",
        "name": "회사 정보 수정",
        "description": "회사에서 직접 관리하는 정보를 수정합니다."
      },
      {
        "code": "COMPANY_INFORMATION_REFRESH_REQUEST",
        "name": "회사 정보 최신화 요청",
        "description": "외부 기관의 최신 회사 정보를 다시 수집하도록 요청합니다."
      },
      {
        "code": "COMPANY_INFORMATION_CHANGE_REVIEW",
        "name": "수집된 변경사항 반영·거절",
        "description": "새로 수집된 회사 정보 변경사항을 반영하거나 거절합니다."
      },
      {
        "code": "COMPANY_VERIFICATION_DOCUMENT_MANAGE",
        "name": "회사 인증 서류 제출·교체",
        "description": "회사 인증에 사용하는 서류를 제출하거나 교체합니다."
      }
    ]
  },
  {
    "code": "MEMBER_MANAGEMENT",
    "name": "직원 관리",
    "permissions": [
      {
        "code": "COMPANY_MEMBER_LIST_VIEW",
        "name": "구성원 목록 조회",
        "description": "회사 구성원과 초대·소속 상태를 조회합니다."
      },
      {
        "code": "COMPANY_MEMBER_INVITE",
        "name": "직원 초대",
        "description": "새 구성원을 회사로 초대합니다."
      },
      {
        "code": "COMPANY_MEMBERSHIP_REQUEST_REVIEW",
        "name": "소속 신청 승인·거절",
        "description": "회사 소속 신청을 승인하거나 거절합니다."
      },
      {
        "code": "COMPANY_MEMBER_PROFILE_EDIT",
        "name": "팀원 정보 편집",
        "description": "팀원의 회사 직급 등 회사 내부 정보를 편집합니다."
      },
      {
        "code": "COMPANY_MEMBER_PERMISSION_MANAGE",
        "name": "팀원 권한 변경",
        "description": "팀원에게 부여된 회사 권한을 변경합니다."
      },
      {
        "code": "COMPANY_MEMBER_REMOVE",
        "name": "팀원 내보내기",
        "description": "팀원의 회사 소속을 종료합니다."
      },
      {
        "code": "COMPANY_POSITION_MANAGE",
        "name": "직급 생성·이름 변경·삭제",
        "description": "회사에서 선택할 수 있는 직급을 관리합니다."
      }
    ]
  },
  {
    "code": "COMPANY_VERIFICATION_AND_MERGE",
    "name": "회사 인증·합치기",
    "permissions": [
      {
        "code": "COMPANY_MERGE_REQUEST",
        "name": "회사 합치기 신청",
        "description": "중복된 회사 정보의 합치기를 신청합니다."
      },
      {
        "code": "COMPANY_MERGE_REVIEW",
        "name": "회사 합치기 승인·거절",
        "description": "다른 회사에서 보낸 합치기 신청을 승인하거나 거절합니다."
      },
      {
        "code": "COMPANY_APPEAL_SUBMIT",
        "name": "이의제기 제출",
        "description": "회사 인증이나 소유 관계에 대한 이의제기를 제출합니다."
      }
    ]
  }
];
const allPermissions = categories.flatMap(category => category.permissions.map(permission => permission.code));
const viewer = ["COMPANY_INFORMATION_VIEW", "COMPANY_MEMBER_LIST_VIEW"];
export function teamCatalogFixture(): CompanyPermissionCatalog {
  return structuredClone({ catalogVersion: "v1", categories, presets: [
    { role: "VIEWER", permissionCodes: viewer },
    { role: "AGENT", permissionCodes: [...viewer, "COMPANY_INFORMATION_EDIT", "COMPANY_INFORMATION_REFRESH_REQUEST", "COMPANY_INFORMATION_CHANGE_REVIEW"] },
    { role: "ADMIN", permissionCodes: allPermissions },
  ] });
}
export function emptyMemberCapabilities(): TeamMemberCapabilities {
  return { canChangePermissions: false, canChangePosition: false, canRemove: false, canSelfDemote: false, canLeave: false,
    canRequestPermissionChange: false, canRequestPositionChange: false, canRequestRemoval: false, canAppointSelfRepresentative: false };
}
export function teamMemberFixtures(): CompanyTeamMember[] {
  return Array.from({ length: 23 }, (_, index) => {
    const role: TeamRole = index === 0 || index === 3 ? "ADMIN" : index === 1 ? "AGENT" : "VIEWER";
    return { membershipId: 9101 + index, displayName: index === 2 ? null : `가상 팀원 ${index + 1}`,
      contactEmail: `team${index + 1}@example.test`, profileImageUrl: null, positionId: index === 0 ? 1 : 2,
      positionName: index === 0 ? "대표자" : "사원", positionType: index === 0 ? "REPRESENTATIVE" : "CUSTOM", role,
      permissions: [...teamCatalogFixture().presets.find(preset => preset.role === role)!.permissionCodes],
      joinedAt: new Date(Date.UTC(2024, 0, 1 + Math.floor(index / 2))).toISOString(),
      lastLoginAt: index === 2 ? null : "2026-11-16T05:00:00Z", version: 1, capabilities: emptyMemberCapabilities() };
  });
}
export function createMockTeamQueries(runtime: MockRuntime, companyFor: (account: string) => number | null): CompanyTeamRepository {
  const scenario = () => runtime.scenario("company");
  async function context(access: AuthAccess, signal?: AbortSignal) {
    const account = await mockAccount(runtime, access, "company", signal);
    return { account, companyId: companyFor(account) };
  }
  function actorPermissions() {
    const role = scenario() === "team-agent" ? "AGENT" : ["team-viewer", "team-extra"].includes(scenario()) ? "VIEWER" : "ADMIN";
    const permissions = [...teamCatalogFixture().presets.find(preset => preset.role === role)!.permissionCodes];
    if (scenario() === "team-extra") permissions.push("COMPANY_MEMBER_INVITE");
    return permissions;
  }
  async function authorize(access: AuthAccess, companyId: number, signal?: AbortSignal) {
    const current = await context(access, signal);
    if (current.companyId !== companyId || scenario() === "team-denied") throw new ApiError(403, "TEAM_FORBIDDEN", "팀원을 조회할 권한이 없어요.");
    return current;
  }
  function members() {
    if (scenario() === "team-empty") return [];
    return teamMemberFixtures().map((member, index) => {
      const permissions = index === 0 ? actorPermissions() : member.permissions;
      const role: TeamRole = permissions.length === allPermissions.length ? "ADMIN" : permissions.includes("COMPANY_INFORMATION_EDIT") ? "AGENT" : "VIEWER";
      const mutable = scenario() !== "team-read-only";
      const writableAdmin = actorPermissions().length === allPermissions.length && mutable;
      return { ...member, role, permissions, positionId: index === 0 && role !== "ADMIN" ? 2 : member.positionId, positionName: index === 0 && role !== "ADMIN" ? "사원" : member.positionName, positionType: index === 0 && role !== "ADMIN" ? "CUSTOM" as const : member.positionType, capabilities: { ...emptyMemberCapabilities(), canChangePermissions: writableAdmin && index > 0 && role !== "ADMIN",
        canChangePosition: writableAdmin && index > 0 && role !== "ADMIN", canRemove: writableAdmin && index > 0 && role !== "ADMIN",
        canLeave: mutable && index === 0, canSelfDemote: mutable && role !== "VIEWER" && index === 0,
        canRequestPermissionChange: writableAdmin && index > 0, canRequestPositionChange: writableAdmin && index > 0 } };
    });
  }
  return {
    async getCompanyTeamContext(access, signal) { const { companyId } = await context(access, signal); return { companyId }; },
    async getCompanyPermissionCatalog(access, signal) { await context(access, signal); return teamCatalogFixture(); },
    async getCurrentCompanyPermissions(access, companyId, signal) {
      validateTeamQuery(companyId); await authorize(access, companyId, signal);
      return { companyId, membershipId: 9101, permissionCodes: actorPermissions() };
    },
    async listCompanyTeamMembers(access, companyId, page = 0, size = 20, signal) {
      validateTeamQuery(companyId, page, size); await authorize(access, companyId, signal);
      const content = members(), permissions = actorPermissions(), writable = scenario() !== "team-read-only";
      return { content: content.slice(page * size, (page + 1) * size), page, size, totalElements: content.length,
        totalPages: Math.ceil(content.length / size), capabilities: { canInvite: writable && permissions.includes("COMPANY_MEMBER_INVITE"),
          canReviewRequests: writable && permissions.includes("COMPANY_MEMBERSHIP_REQUEST_REVIEW"), canManagePositions: writable && permissions.includes("COMPANY_POSITION_MANAGE") } };
    },
    async getCompanyTeamMember(access, companyId, membershipId, signal) {
      validateTeamQuery(companyId); validateTeamMemberId(membershipId); await authorize(access, companyId, signal);
      const member = members().find(item => item.membershipId === membershipId);
      if (!member) throw new ApiError(404, "TEAM_MEMBER_NOT_FOUND", "팀원을 찾지 못했어요. 소속이 변경됐을 수 있어요.");
      return member;
    },
  };
}
