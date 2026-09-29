import { CheckIcon } from "@/components/icons";

export type BidCardVariant = "fill" | "stroke";
export type BidCardCategoryTone = "primary" | "success" | "warning";

export type BidCardProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
    variant?: BidCardVariant;
    selected?: boolean;
    categoryTone?: BidCardCategoryTone;
    category: React.ReactNode;
    publishedAt: React.ReactNode;
    title: React.ReactNode;
    noticeNumber: React.ReactNode;
    organization: React.ReactNode;
    contractMethod: React.ReactNode;
    closesAt: React.ReactNode;
    estimatedPrice: React.ReactNode;
    estimatedPriceUnit?: React.ReactNode;
};

type BidCardDetailRowProps = {
    label: React.ReactNode;
    value: React.ReactNode;
    accent?: boolean;
    underlined?: boolean;
};

const variantClasses: Record<BidCardVariant, string> = {
    fill: "border border-transparent shadow-[0_0_12px_var(--grayscale-100)]",
    stroke: "border border-grayscale-200",
};

const categoryToneClasses: Record<BidCardCategoryTone, string> = {
    primary: "bg-primary-100 text-primary-400",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
};

export function BidCard({
    category,
    categoryTone = "primary",
    children,
    className,
    closesAt,
    contractMethod,
    estimatedPrice,
    estimatedPriceUnit = "원",
    noticeNumber,
    organization,
    publishedAt,
    selected = false,
    title,
    variant = "fill",
    ...props
}: BidCardProps) {
    return (
        <article
            className={[
                "relative flex w-full max-w-[380px] flex-col gap-5 overflow-hidden rounded-[20px] bg-basic-white p-5",
                selected ? "border border-[rgba(233,236,239,0.2)] shadow-none" : variantClasses[variant],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            data-selected={selected || undefined}
            {...props}
        >
            <div className={["flex flex-col gap-5", selected ? "opacity-10" : ""].filter(Boolean).join(" ")}>
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-4">
                        <span className={`type-caption-2 inline-flex min-h-6 shrink-0 items-center justify-center rounded-[6px] px-2 py-[3.5px] ${categoryToneClasses[categoryTone]}`}>
                            <span className="whitespace-nowrap">{category}</span>
                        </span>
                        <span className="type-body-7 shrink-0 whitespace-nowrap text-grayscale-500">
                            {publishedAt}
                        </span>
                    </div>
                    <h3 className="type-body-1 break-words text-grayscale-800">{title}</h3>
                </div>

                <dl className="flex flex-col gap-3 rounded-2xl bg-grayscale-50 p-5">
                    <BidCardDetailRow label="공고번호" underlined value={noticeNumber} />
                    <BidCardDetailRow label="기관" value={organization} />
                    <BidCardDetailRow label="계약방법" value={contractMethod} />
                    <BidCardDetailRow label="투찰마감" value={closesAt} />
                    <BidCardDetailRow
                        accent
                        label="추정가격"
                        value={
                            <span>
                                {estimatedPrice}
                                {estimatedPriceUnit}
                            </span>
                        }
                    />
                </dl>
                {children}
            </div>

            {selected && (
                <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex size-12 items-center justify-center text-grayscale-300">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-grayscale-50">
                            <CheckIcon className="size-5" />
                        </span>
                    </span>
                </div>
            )}
        </article>
    );
}

function BidCardDetailRow({ accent = false, label, underlined = false, value }: BidCardDetailRowProps) {
    return (
        <div className="type-body-7 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
            <dt className="shrink-0 whitespace-nowrap text-grayscale-600">{label}</dt>
            <dd
                className={[
                    "type-body-6 min-w-0 break-words text-right",
                    accent ? "text-primary-400" : "text-grayscale-700",
                    underlined ? "underline decoration-solid [text-underline-position:from-font]" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {value}
            </dd>
        </div>
    );
}
