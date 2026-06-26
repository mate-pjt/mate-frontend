'use client';

import { useState } from "react";

import { LeftArrowIcon, RightArrowIcon } from "@/components/icons";

type PaginationPageItem = number | "start-ellipsis" | "end-ellipsis";
type PaginationState = {
    page: number;
    pageCount: number;
};

export type PaginationProps = Omit<React.HTMLAttributes<HTMLElement>, "onChange"> & {
    page?: number;
    defaultPage?: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    ariaLabel?: string;
};

export function Pagination({
    ariaLabel = "페이지네이션",
    className,
    defaultPage = 1,
    onPageChange,
    page,
    totalPages,
    ...props
}: PaginationProps) {
    const pageCount = Math.max(1, Math.floor(totalPages));
    const [paginationState, setPaginationState] = useState<PaginationState>({
        page: clampPage(defaultPage, pageCount),
        pageCount,
    });
    let internalPage = paginationState.page;

    if (page === undefined && paginationState.pageCount !== pageCount) {
        internalPage = clampPage(paginationState.page, pageCount);
        setPaginationState({ page: internalPage, pageCount });
    }

    const currentPage = clampPage(page ?? internalPage, pageCount);
    const items = getPaginationItems(currentPage, pageCount);

    function changePage(nextPage: number) {
        const clampedPage = clampPage(nextPage, pageCount);

        if (clampedPage === currentPage) {
            return;
        }

        if (page === undefined) {
            setPaginationState({ page: clampedPage, pageCount });
        }

        onPageChange?.(clampedPage);
    }

    return (
        <nav
            aria-label={ariaLabel}
            className={["inline-flex items-center gap-[6px]", className].filter(Boolean).join(" ")}
            {...props}
        >
            <PaginationArrow
                ariaLabel="이전 페이지"
                disabled={currentPage === 1}
                direction="previous"
                onClick={() => changePage(currentPage - 1)}
            />
            {items.map((item) => {
                if (typeof item !== "number") {
                    return <PaginationEllipsis key={item} />;
                }

                return (
                    <PaginationNumber
                        current={item === currentPage}
                        key={item}
                        onClick={() => changePage(item)}
                        page={item}
                    />
                );
            })}
            <PaginationArrow
                ariaLabel="다음 페이지"
                disabled={currentPage === pageCount}
                direction="next"
                onClick={() => changePage(currentPage + 1)}
            />
        </nav>
    );
}

function PaginationNumber({
    current,
    onClick,
    page,
}: {
    current: boolean;
    onClick: () => void;
    page: number;
}) {
    return (
        <button
            aria-current={current ? "page" : undefined}
            aria-label={`${page}페이지`}
            className={[
                "inline-flex size-[30px] shrink-0 items-center justify-center rounded-full type-body-6 transition-colors",
                current
                    ? "bg-grayscale-50 text-grayscale-700"
                    : "text-grayscale-600 hover:bg-grayscale-50 hover:text-grayscale-700",
            ]
                .filter(Boolean)
                .join(" ")}
            onClick={onClick}
            type="button"
        >
            {page}
        </button>
    );
}

function PaginationEllipsis() {
    return (
        <span
            aria-hidden
            className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-full text-grayscale-600 type-body-6"
        >
            ···
        </span>
    );
}

function PaginationArrow({
    ariaLabel,
    direction,
    disabled,
    onClick,
}: {
    ariaLabel: string;
    direction: "previous" | "next";
    disabled: boolean;
    onClick: () => void;
}) {
    const Icon = direction === "previous" ? LeftArrowIcon : RightArrowIcon;

    return (
        <button
            aria-label={ariaLabel}
            className={[
                "inline-flex size-[30px] shrink-0 items-center justify-center rounded-full text-grayscale-600 transition-colors",
                disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-grayscale-50 hover:text-grayscale-700",
            ]
                .filter(Boolean)
                .join(" ")}
            disabled={disabled}
            onClick={onClick}
            type="button"
        >
            <Icon aria-hidden className="size-5" focusable="false" />
        </button>
    );
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationPageItem[] {
    if (totalPages <= 7) {
        return range(1, totalPages);
    }

    if (currentPage <= 3) {
        return [...range(1, 5), "end-ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, "start-ellipsis", ...range(totalPages - 4, totalPages)];
    }

    return [
        1,
        "start-ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "end-ellipsis",
        totalPages,
    ];
}

function range(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function clampPage(page: number, totalPages: number) {
    return Math.min(Math.max(1, Math.floor(page)), totalPages);
}
