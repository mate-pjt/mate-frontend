export function calendarDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function calendarToday(now = new Date()): string {
  return calendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function daysInMonth(year: number, month: number): number {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  return year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
}

export function isDateInRange(value: string, minDate: string, maxDate: string): boolean {
  return isCalendarDate(value) && value >= minDate && value <= maxDate;
}

export function clampCalendarDate(value: string, minDate: string, maxDate: string): string {
  return value < minDate ? minDate : value > maxDate ? maxDate : value;
}

export function shiftCalendarMonth(value: string, amount: number): string {
  const [year, month, day] = value.split("-").map(Number);
  const index = Math.max(12, Math.min(9999 * 12 + 11, year * 12 + month - 1 + amount));
  const nextYear = Math.floor(index / 12);
  const nextMonth = index % 12 + 1;
  return calendarDate(nextYear, nextMonth, Math.min(day, daysInMonth(nextYear, nextMonth)));
}

export function shiftCalendarDay(value: string, amount: number): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  if (date.getUTCFullYear() < 1) return "0001-01-01";
  if (date.getUTCFullYear() > 9999) return "9999-12-31";
  return calendarDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function calendarWeeks(value: string): Array<Array<string | null>> {
  const [year, month] = value.split("-").map(Number);
  const offset = new Date(`${calendarDate(year, month, 1)}T00:00:00Z`).getUTCDay();
  const count = daysInMonth(year, month);
  return Array.from({ length: Math.ceil((offset + count) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const day = week * 7 + weekday - offset + 1;
      return day > 0 && day <= count ? calendarDate(year, month, day) : null;
    }),
  );
}
