'use client';

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

import { SearchInput } from "@/components/ui/input";
import { useAuthSession } from "@/features/auth/session";
import { BID_SEARCH_MAX_LENGTH, type RecentBidSearch } from "@/features/bids/recent-searches";

type BidListSearchProps = {
  readonly initialValue: string;
  readonly onSearch: (query: string) => void;
  readonly recentSearchesEnabled?: boolean;
};

export function BidListSearch({ initialValue, onSearch, recentSearchesEnabled = true }: BidListSearchProps) {
  const { recentBidSearches } = useAuthSession();
  const entries = useSyncExternalStore(recentBidSearches.subscribe, recentBidSearches.getSnapshot, recentBidSearches.getServerSnapshot);
  const [sourceValue, setSourceValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);
  const [showRecent, setShowRecent] = useState(false);
  const popupId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const open = recentSearchesEnabled && showRecent && value.length === 0 && entries.length > 0;

  if (initialValue !== sourceValue) {
    setSourceValue(initialValue);
    setValue(initialValue);
    setShowRecent(false);
  }

  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !formRef.current?.contains(event.target)) {
        lastFocused.current = null;
        setShowRecent(false);
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useLayoutEffect(() => {
    if (lastFocused.current && !lastFocused.current.isConnected && document.activeElement === document.body) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [entries]);

  function openRecent() {
    if (!recentSearchesEnabled) return;
    recentBidSearches.expire();
    setShowRecent(true);
  }

  function search(query: string) {
    setValue(query);
    setShowRecent(false);
    onSearch(query);
  }

  return (
    <form
      className="relative w-[300px] min-w-0 max-w-full"
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        lastFocused.current = null;
        setShowRecent(false);
      }}
      onFocus={(event) => { lastFocused.current = event.target; }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || event.nativeEvent.isComposing || !open) return;
        event.preventDefault();
        event.stopPropagation();
        inputRef.current?.focus({ preventScroll: true });
        setShowRecent(false);
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        if (recentSearchesEnabled) recentBidSearches.record(query);
        search(query);
      }}
      ref={formRef}
    >
      <SearchInput
        aria-controls={open ? popupId : undefined}
        aria-label="공고명, 공고번호, 공고기관명, 수요기관명 검색"
        autoComplete="off"
        className="h-9 w-full"
        maxLength={BID_SEARCH_MAX_LENGTH}
        onClick={openRecent}
        onFocus={(event) => {
          inputRef.current = event.currentTarget;
          openRecent();
        }}
        onValueChange={(next) => {
          setValue(next);
          if (next.length === 0) openRecent();
        }}
        placeholder="공고명·번호·공고/수요기관"
        value={value}
        variant="popup"
      />
      {open && (
        <RecentSearchList
          entries={entries}
          id={popupId}
          onClear={() => {
            inputRef.current?.focus({ preventScroll: true });
            recentBidSearches.clear();
          }}
          onRemove={(entry) => {
            inputRef.current?.focus({ preventScroll: true });
            recentBidSearches.remove(entry);
          }}
          onSelect={(entry) => {
            if (!recentBidSearches.select(entry)) return;
            inputRef.current?.focus({ preventScroll: true });
            search(entry.query);
          }}
        />
      )}
    </form>
  );
}

function RecentSearchList({ entries, id, onClear, onRemove, onSelect }: {
  entries: readonly RecentBidSearch[];
  id: string;
  onClear: () => void;
  onRemove: (entry: RecentBidSearch) => void;
  onSelect: (entry: RecentBidSearch) => void;
}) {
  const actionFocus = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary";

  return (
    <section
      aria-label="최근 검색어"
      className="mt-2.5 w-full rounded-lg border border-border bg-surface p-2 sm:absolute sm:inset-x-0 sm:top-full sm:z-30"
      id={id}
    >
      <div className="flex items-center justify-between gap-2 px-2 text-grayscale-700 type-body-7">
        <p>최근 검색어</p>
        <button className={`min-h-7 rounded px-1 hover:underline ${actionFocus}`} onClick={onClear} type="button">
          전체 지우기
        </button>
      </div>
      <ul>
        {entries.map((entry) => (
          <li className="flex items-center" key={entry.query}>
            <button
              className={`flex min-h-9 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-left text-grayscale-700 type-body-7 hover:bg-grayscale-50 ${actionFocus}`}
              onClick={() => onSelect(entry)}
              title={entry.query}
              type="button"
            >
              <span aria-hidden="true" className="size-4 shrink-0 bg-[url('/icon/recent-search-clock.svg')] bg-center bg-no-repeat" />
              <span className="truncate">{entry.query}</span>
            </button>
            <button
              aria-label={`최근 검색어 ${entry.query} 삭제`}
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-grayscale-50 ${actionFocus}`}
              onClick={() => onRemove(entry)}
              type="button"
            >
              <Image alt="" height={16} src="/icon/24dp/close_circle.svg" width={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
