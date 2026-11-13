import { describe, expect, it } from "vitest";
import { calendarToday, calendarWeeks, clampCalendarDate, isCalendarDate, isDateInRange, shiftCalendarDay, shiftCalendarMonth } from "@/components/ui/calendar/calendar-date";

describe("달력의 실제 날짜와 생년월일 경계", () => {
  it.each(["2024-02-29", "2000-02-29", "1900-01-01", "2026-11-13"])("유효한 날짜 %s", (value) => expect(isCalendarDate(value)).toBe(true));
  it.each(["1900-02-29", "2026-02-29", "2026-04-31", "2026-13-01", "0000-01-01", "2026-1-01", "2026-11-00"])("존재하지 않는 날짜 %s 거부", (value) => expect(isCalendarDate(value)).toBe(false));
  it("오늘과 최소일을 포함하고 미래·최소 미만·빈값을 거부한다", () => {
    expect(isDateInRange("1900-01-01", "1900-01-01", "2026-11-13")).toBe(true);
    expect(isDateInRange("2026-11-13", "1900-01-01", "2026-11-13")).toBe(true);
    for (const value of ["1899-12-31", "2026-11-14", "", "2026-02-30"]) expect(isDateInRange(value, "1900-01-01", "2026-11-13")).toBe(false);
  });
  it("2026년 1월의 목요일 시작과 주별 일요일, 빈 셀을 보존한다", () => {
    const weeks = calendarWeeks("2026-01-01");
    expect(weeks).toHaveLength(5);
    expect(weeks[0]).toEqual([null, null, null, null, "2026-01-01", "2026-01-02", "2026-01-03"]);
    expect(weeks[1][0]).toBe("2026-01-04");
    expect(weeks.flat().filter(Boolean)).toHaveLength(31);
    expect(calendarWeeks("2026-08-01")).toHaveLength(6);
    expect(calendarWeeks("2024-02-01").flat().filter(Boolean)).toHaveLength(29);
  });
  it("월말·윤년·연도 이동을 clamp하고 연도 범위를 벗어나지 않는다", () => {
    expect(shiftCalendarMonth("2024-01-31", 1)).toBe("2024-02-29");
    expect(shiftCalendarMonth("2024-02-29", 12)).toBe("2025-02-28");
    expect(shiftCalendarMonth("2026-01-31", -1)).toBe("2025-12-31");
    expect(shiftCalendarMonth("0001-01-01", -1)).toBe("0001-01-01");
    expect(shiftCalendarMonth("9999-12-31", 1)).toBe("9999-12-31");
  });
  it("일 단위 keyboard 이동은 DST와 관계없이 월/연도 경계를 넘는다", () => {
    expect(shiftCalendarDay("2024-02-28", 1)).toBe("2024-02-29");
    expect(shiftCalendarDay("2024-03-01", -1)).toBe("2024-02-29");
    expect(shiftCalendarDay("2026-03-08", 7)).toBe("2026-03-15");
    expect(shiftCalendarDay("2026-12-31", 1)).toBe("2027-01-01");
    expect(shiftCalendarDay("0001-01-01", -1)).toBe("0001-01-01");
  });
  it("이동 범위를 제한하고 오늘은 주입한 브라우저 현지 날짜를 사용한다", () => {
    expect(clampCalendarDate("1899-12-31", "1900-01-01", "2026-11-13")).toBe("1900-01-01");
    expect(clampCalendarDate("2027-01-01", "1900-01-01", "2026-11-13")).toBe("2026-11-13");
    expect(calendarToday(new Date(2026, 10, 13, 1))).toBe("2026-11-13");
  });
});
