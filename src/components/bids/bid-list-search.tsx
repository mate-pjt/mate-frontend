'use client';

import { useState } from "react";

import { SearchInput } from "@/components/ui/input";

type BidListSearchProps = {
  readonly initialValue: string;
  readonly onSearch: (query: string) => void;
};

export function BidListSearch({ initialValue, onSearch }: BidListSearchProps) {
  const [value, setValue] = useState(initialValue);

  function submit() {
    const query = value.trim();
    setValue(query);
    onSearch(query);
  }

  return (
    <form
      className="w-[300px]"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <SearchInput
        aria-label="공고명, 공고번호, 공고기관명, 수요기관명 검색"
        className="h-9 w-full"
        maxLength={100}
        onValueChange={setValue}
        placeholder="공고명·번호·공고/수요기관"
        value={value}
        variant="popup"
      />
    </form>
  );
}
