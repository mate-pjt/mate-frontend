"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LeftArrowIcon, RightArrowIcon } from "@/components/icons";
import { calendarDate, calendarToday, calendarWeeks, clampCalendarDate, daysInMonth, isDateInRange, shiftCalendarDay, shiftCalendarMonth } from "./calendar-date";

export type CalendarProps = {
  value: string;
  onValueChange: (value: string) => void;
  minDate: string;
  maxDate: string;
  today?: string;
  autoFocus?: boolean;
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export function Calendar({ value, onValueChange, minDate, maxDate, today = calendarToday(), autoFocus = false }: CalendarProps) {
  const initialDate = isDateInRange(value, minDate, maxDate) ? value : clampCalendarDate(today, minDate, maxDate);
  const [navigation, setNavigation] = useState({ value, date: initialDate });
  const focusRequested = useRef(autoFocus);
  const dayButtons = useRef(new Map<string, HTMLButtonElement>());
  const headingId = useId();
  let activeDate = navigation.date;
  if (navigation.value !== value) {
    activeDate = initialDate;
    setNavigation({ value, date: activeDate });
  }
  const [year, month, day] = activeDate.split("-").map(Number);
  const weeks = calendarWeeks(activeDate);
  const firstYear = Number(minDate.slice(0, 4));
  const lastYear = Number(maxDate.slice(0, 4));
  const previousMonth = shiftCalendarMonth(activeDate, -1);
  const nextMonth = shiftCalendarMonth(activeDate, 1);

  useEffect(() => {
    if (focusRequested.current) {
      dayButtons.current.get(activeDate)?.focus();
      focusRequested.current = false;
    }
  }, [activeDate]);

  function navigate(date: string, focus = false) {
    focusRequested.current = focus;
    setNavigation({ value, date: clampCalendarDate(date, minDate, maxDate) });
  }

  function changeMonth(nextYear: number, nextMonth: number) {
    navigate(calendarDate(nextYear, nextMonth, Math.min(day, daysInMonth(nextYear, nextMonth))));
  }

  function handleDayKey(event: React.KeyboardEvent<HTMLButtonElement>, date: string) {
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday };
    if (event.key in offsets) {
      event.preventDefault();
      navigate(shiftCalendarDay(date, offsets[event.key]), true);
    } else if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      navigate(shiftCalendarMonth(date, (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1)), true);
    }
  }

  return (
    <div className="w-[320px] max-w-full rounded-lg border border-grayscale-200 bg-white p-[23px]">
      <div className="mb-4 flex items-center justify-center gap-2">
        <button aria-label="이전 달" className="flex size-5 items-center justify-center rounded text-grayscale-700 disabled:text-grayscale-500 focus-visible:outline-2 focus-visible:outline-primary" disabled={previousMonth.slice(0, 7) < minDate.slice(0, 7) || previousMonth === activeDate} onClick={() => navigate(previousMonth)} type="button">
          <LeftArrowIcon aria-hidden className="size-5" />
        </button>
        <div className="flex gap-1 text-grayscale-800 type-body-1">
          <select aria-label="연도" className="cursor-pointer appearance-none rounded bg-white focus-visible:outline-2 focus-visible:outline-primary" onChange={(event) => changeMonth(Number(event.target.value), month)} value={year}>
            {Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index).map((item) => <option key={item} value={item}>{item}년</option>)}
          </select>
          <select aria-label="월" className="cursor-pointer appearance-none rounded bg-white focus-visible:outline-2 focus-visible:outline-primary" onChange={(event) => changeMonth(year, Number(event.target.value))} value={month}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => <option disabled={calendarDate(year, item, daysInMonth(year, item)) < minDate || calendarDate(year, item, 1) > maxDate} key={item} value={item}>{item}월</option>)}
          </select>
        </div>
        <button aria-label="다음 달" className="flex size-5 items-center justify-center rounded text-grayscale-700 disabled:text-grayscale-500 focus-visible:outline-2 focus-visible:outline-primary" disabled={nextMonth.slice(0, 7) > maxDate.slice(0, 7) || nextMonth === activeDate} onClick={() => navigate(nextMonth)} type="button">
          <RightArrowIcon aria-hidden className="size-5" />
        </button>
      </div>
      <p aria-live="polite" className="sr-only" id={headingId}>{year}년 {month}월</p>
      <div aria-labelledby={headingId} role="grid">
        <div className="mb-[30px] grid grid-cols-7 gap-2" role="row">
          {weekdays.map((weekday, index) => <span className={`text-center type-body-7 ${index === 0 ? "text-primary" : "text-grayscale-700"}`} key={weekday} role="columnheader">{weekday}</span>)}
        </div>
        <div className="space-y-3">
          {weeks.map((week, index) => (
            <div className="grid grid-cols-7 gap-2" key={index} role="row">
              {week.map((date, weekday) => date ? (
                <div aria-selected={date === value} key={date} role="gridcell">
                  <button
                    aria-current={date === today ? "date" : undefined}
                    aria-label={`${year}년 ${month}월 ${Number(date.slice(8))}일 ${weekdays[weekday]}요일`}
                    className={`flex aspect-square w-full items-center justify-center rounded-full type-body-7 enabled:hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-35 ${date === value ? "bg-primary text-white enabled:hover:bg-primary-hover" : weekday === 0 ? "text-primary" : "text-grayscale-600"}`}
                    disabled={!isDateInRange(date, minDate, maxDate)}
                    onClick={() => { navigate(date); onValueChange(date); }}
                    onFocus={() => { if (date !== activeDate) navigate(date); }}
                    onKeyDown={(event) => handleDayKey(event, date)}
                    ref={(node) => { if (node) dayButtons.current.set(date, node); else dayButtons.current.delete(date); }}
                    tabIndex={date === activeDate ? 0 : -1}
                    type="button"
                  >{Number(date.slice(8))}</button>
                </div>
              ) : <span aria-hidden className="aspect-square" key={`empty-${weekday}`} role="gridcell" />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
