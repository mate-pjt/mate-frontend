import { describe, expect, it } from "vitest";
import { safeNotificationPath } from "@/lib/notification-path";

describe("POL-04 v1 알림 경로", () => {
  it.each([
    ["/my/company", "/my/company"],
    ["/bids/1", "/bids/1"],
    ["/bids/9007199254740991", "/bids/9007199254740991"],
    ["/bids/10001?bidClsfcNo=2", "/bids/10001?bidClsfcNo=2"],
    ["/bids/1?bidClsfcNo=%ED%95%9C%EA%B8%80%26%3D%2B", "/bids/1?bidClsfcNo=%ED%95%9C%EA%B8%80%26%3D%2B"],
    [`/bids/1?bidClsfcNo=${"a".repeat(50)}`, `/bids/1?bidClsfcNo=${"a".repeat(50)}`],
  ])("허용 경로 %s를 안전하게 유지한다", (input, expected) => {
    expect(safeNotificationPath(input)).toBe(expected);
    expect(safeNotificationPath(expected)).toBe(expected);
  });

  it.each([
    null, undefined, 1, {}, "", "bids/1", " /bids/1", "/bids/1\n", "/bids/1\u0000",
    "https://example.test/bids/1", "http://localhost/bids/1", "javascript:alert(1)", "//example.test/bids/1",
    "/\\example.test/bids/1", "/bids\\1", "/bids/../1", "/bids/./1", "/my/../my/company",
    "/%62ids/1", "/bids%2f1", "/bids/%31", "/bids/%2e%2e/1", "/bids/%252f1",
    "/bids/0", "/bids/-1", "/bids/01", "/bids/1.0", "/bids/1e2", "/bids/9007199254740992", "/bids/1/",
    "/bids/1#", "/bids/1#x", "/bids/1?", "/bids/1?bidClsfcNo=", "/bids/1?next=/my/company",
    "/bids/1?bidClsfcNo=1&bidClsfcNo=2", "/bids/1?bidClsfcNo=1&next=x", "/bids/1?bidClsfcNo=1&",
    "/bids/1?%62idClsfcNo=1", "/bids/1?bidClsfcNo=%", "/bids/1?bidClsfcNo=%C0%AF", "/bids/1?bidClsfcNo=%EF%BF",
    "/bids/1?bidClsfcNo=%2F", "/bids/1?bidClsfcNo=%5C", "/bids/1?bidClsfcNo=%00", "/bids/1?bidClsfcNo=%0D%0A",
    "/bids/1?bidClsfcNo=%252f", "/bids/1?bidClsfcNo=%250a", "/bids/1?bidClsfcNo=+", "/bids/1?bidClsfcNo=%20",
    "/bids/1?bidClsfcNo=%C2%85", "/bids/1?bidClsfcNo=%E2%80%AE", "/bids/1?bidClsfcNo=\u0085", "/bids/1?bidClsfcNo=\u202e",
    "/bids/1?bidClsfcNo=..", `/bids/1?bidClsfcNo=${"a".repeat(51)}`,
    "/my/company?companyId=1", "/my/company/", "/my/company#x", "/my/company-merge/1", "/news/1", "/auth", "/api/v1/me/notifications",
  ])("위험·무효·미지원 입력 %j를 거절한다", (input) => {
    expect(safeNotificationPath(input)).toBeNull();
  });
});
