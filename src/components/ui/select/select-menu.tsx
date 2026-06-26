'use client';

/**
 * TODO: 일반 select menu 뿐만 아니라, "04. 0.0v"의 "01_all_bidlist_defualt"의 "public_category" 같은 유형의 select menu도 이 컴포넌트를 사용하게 할 수 있도록 해야 함
 * (각 항목 좌측에 '아이콘' 옵션 추가, 모든 항목 아래 '안내문구' 옵션, 안내문구 아래 버튼('초기화', '저장') 옵션) 
 * */

import { CheckIcon, LimitIcon } from "@/components/icons";

const selectMenuIcons = {
    limit: LimitIcon,
} as const;

const variantClasses = {
    default: {
        root: "w-[212px] rounded-[16px]",
        item: "justify-between text-grayscale-700 hover:bg-grayscale-50 hover:text-[#7C7F83]",
        selected: "bg-primary-100 text-primary",
        showSelectedIcon: true,
    },
    search: {
        root: "w-[300px] rounded-[8px]",
        item: "gap-2 text-grayscale-700 hover:bg-grayscale-50 hover:text-[#7C7F83]",
        selected: "",
        showSelectedIcon: false,
    },
} as const;

export type SelectMenuOption = {
    value: string;
    label: string;
    icon?: SelectMenuIconName;
    disabled?: boolean;
};

export type SelectMenuIconName = keyof typeof selectMenuIcons;
export type SelectMenuVariant = keyof typeof variantClasses;

export type SelectMenuProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
    options: SelectMenuOption[];
    selectedValue?: string;
    onSelect?: (option: SelectMenuOption) => void;
    variant?: SelectMenuVariant;
};

export function SelectMenu({
    className,
    onSelect,
    options,
    selectedValue,
    variant = "default",
    ...props
}: SelectMenuProps) {
    const classes = variantClasses[variant];

    return (
        <div
            className={[
                "border border-grayscale-200 bg-white p-2",
                classes.root,
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
                            "flex min-h-9 w-full items-center rounded-[8px] p-2 text-left type-body-7 transition-colors",
                            classes.item,
                            selected ? classes.selected : "",
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
                        {option.icon && (
                            <span className="flex size-4 shrink-0 items-center justify-center text-grayscale-500">
                                <SelectMenuIcon icon={option.icon} />
                            </span>
                        )}
                        <span className="truncate">{option.label}</span>
                        {classes.showSelectedIcon && (
                            <CheckIcon
                                aria-hidden
                                className={["size-4 shrink-0", selected ? "opacity-100" : "opacity-0"].join(" ")}
                                focusable="false"
                                height={16}
                                width={16}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function SelectMenuIcon({ icon }: { icon: SelectMenuIconName }) {
    const Icon = selectMenuIcons[icon];

    return <Icon aria-hidden className="size-4" focusable="false" />;
}
