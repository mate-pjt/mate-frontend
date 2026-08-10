'use client';

import { useEffect, useId, useRef, useState } from "react";

import { SelectBox, type SelectBoxSize, type SelectBoxVariant } from "./select-box";
import { SelectMenu, type SelectMenuOption, type SelectMenuVariant } from "./select-menu";

const menuAlignClasses = {
    left: "left-0",
    right: "right-0",
} as const;

export type SelectProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
    options: readonly SelectMenuOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, option: SelectMenuOption) => void;
    placeholder?: string;
    disabled?: boolean;
    size?: SelectBoxSize;
    variant?: SelectBoxVariant;
    align?: keyof typeof menuAlignClasses;
    boxClassName?: string;
    menuClassName?: string;
    menuVariant?: SelectMenuVariant;
    ariaLabel?: string;
};

export type SelectOption = SelectMenuOption;

export function Select({
    align = "left",
    ariaLabel,
    boxClassName,
    className,
    defaultValue,
    disabled = false,
    menuClassName,
    menuVariant = "default",
    onValueChange,
    options,
    placeholder = "옵션",
    size = "s",
    value,
    variant = "white",
    ...props
}: SelectProps) {
    const menuId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);

    const selectedValue = value ?? internalValue;
    const selectedOption = options.find((option) => option.value === selectedValue);

    useEffect(() => {
        if (!open) {
            return;
        }

        function handlePointerDown(event: PointerEvent) {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    return (
        <div
            className={["relative inline-flex", className].filter(Boolean).join(" ")}
            ref={rootRef}
            {...props}
        >
            <SelectBox
                aria-controls={open ? menuId : undefined}
                aria-label={ariaLabel}
                className={boxClassName}
                disabled={disabled}
                onClick={() => setOpen((current) => !current)}
                open={open}
                placeholder={placeholder}
                size={size}
                variant={variant}
            >
                {selectedOption?.label}
            </SelectBox>
            {open && !disabled && (
                <SelectMenu
                    className={[
                        "absolute top-[calc(100%+8px)] z-20 shadow-[var(--shadow-floating)]",
                        menuAlignClasses[align],
                        menuClassName,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    id={menuId}
                    onSelect={(option) => {
                        setInternalValue(option.value);
                        setOpen(false);
                        onValueChange?.(option.value, option);
                    }}
                    options={options}
                    selectedValue={selectedValue}
                    variant={menuVariant}
                />
            )}
        </div>
    );
}
