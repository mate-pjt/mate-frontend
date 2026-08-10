'use client';

import { useState } from "react";

import { SearchInput } from "@/components/ui/input";

type BidListSearchProps = {
  readonly initialValue: string;
  readonly onSearch: (query: string) => void;
};

const recentSearches = ["신축", "공사"] as const;
const suggestedSearches = ["실내공사", "실내건축", "환경개선공사"] as const;

export function BidListSearch({ initialValue, onSearch }: BidListSearchProps) {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const options = value
    ? suggestedSearches.filter((keyword) => keyword.includes(value))
    : recentSearches;

  function submit(query = value) {
    setValue(query);
    setFocused(false);
    onSearch(query.trim());
  }

  return (
    <form
      className="relative w-[300px]"
      onBlurCapture={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
      onFocusCapture={() => setFocused(true)}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <SearchInput
        aria-label="입찰공고 검색"
        className="h-9 w-full"
        onValueChange={setValue}
        placeholder="공고명, 공고번호, 발주기관으로 찾기"
        value={value}
        variant="popup"
      />
      {focused && options.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[12px] border border-grayscale-200 bg-white py-2 shadow-[var(--shadow-floating)]">
          <p className="px-4 py-2 text-grayscale-500 type-body-7">{value ? "추천 검색어" : "최근 검색어"}</p>
          {options.map((option) => (
            <button
              className="flex w-full px-4 py-2 text-left text-grayscale-700 hover:bg-grayscale-50 type-body-5"
              key={option}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => submit(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
