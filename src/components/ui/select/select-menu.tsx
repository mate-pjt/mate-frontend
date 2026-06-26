'use client';

/**
 * TODO: 일반 select menu 뿐만 아니라, "04. 0.0v"의 "01_all_bidlist_defualt"의 "public_category" 같은 유형의 select menu도 이 컴포넌트를 사용하게 할 수 있도록 해야 함
 * (각 항목 좌측에 '아이콘' 옵션 추가, 모든 항목 아래 '안내문구' 옵션, 안내문구 아래 버튼('초기화', '저장') 옵션) 
 * */

import { CheckIcon } from "@/components/icons";

export type SelectMenuOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

type SelectMenuProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
    options: SelectMenuOption[];
    selectedValue?: string;
    onSelect?: (option: SelectMenuOption) => void;
};

export function SelectMenu({
    className,
    onSelect,
    options,
    selectedValue,
    ...props
}: SelectMenuProps) {
    return (
        <div
            className={[
                "w-[212px] rounded-[16px] border border-grayscale-200 bg-white p-2",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            role="listbox"
            {...props}
        >
            {options.map((option) => {
                const selected = option.value === selectedValue;

                return (
                    <button
                        aria-selected={selected}
                        className={[
                            "flex min-h-9 w-full items-center justify-between gap-2 rounded-[8px] p-2 text-left type-body-7 transition-colors",
                            selected
                                ? "bg-primary-100 text-primary"
                                : "text-grayscale-700 hover:bg-grayscale-50 hover:text-[#7C7F83]",
                            option.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        disabled={option.disabled}
                        key={option.value}
                        onClick={() => onSelect?.(option)}
                        role="option"
                        type="button"
                    >
                        <span className="truncate">{option.label}</span>
                        <CheckIcon
                            aria-hidden
                            className={["size-4 shrink-0", selected ? "opacity-100" : "opacity-0"].join(" ")}
                            focusable="false"
                            height={16}
                            width={16}
                        />
                    </button>
                );
            })}
        </div>
    );
}
