'use client';

import Image from "next/image";

import { CheckIcon, CloseIcon } from "@/components/icons";
import { CheckboxCircle, CheckboxSquare } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";

type PopupWidth = "basic" | "sm" | "md";
type PopupButtonTone = "primary" | "secondary" | "danger";

type PopupAction = {
    label: string;
    disabled?: boolean;
    tone?: PopupButtonTone;
    onClick?: () => void;
};

function mergeClasses(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function PopupShell({
    children,
    className,
    footer,
    width = "sm",
}: React.HTMLAttributes<HTMLDivElement> & {
    footer?: React.ReactNode;
    width?: PopupWidth;
}) {
    return (
        <section
            className={mergeClasses(
                "flex flex-col items-start rounded-[24px]",
                width === "basic" && "w-[420px]",
                width === "sm" && "w-[458px]",
                width === "md" && "w-[640px]",
                className,
            )}
        >
            <div className="w-full rounded-t-[20px] border-x border-t border-grayscale-200 bg-white p-6">
                {children}
            </div>
            {footer && (
                <footer className="w-full rounded-b-[20px] border-x border-b border-grayscale-200 bg-white p-6">
                    {footer}
                </footer>
            )}
        </section>
    );
}

function PopupCloseButton({ onClick }: { onClick?: () => void }) {
    return (
        <button
            aria-label="닫기"
            className="inline-flex size-6 cursor-pointer items-center justify-center text-grayscale-700 hover:text-[#7C7F83]"
            onClick={onClick}
            type="button"
        >
            <CloseIcon aria-hidden className="size-6" focusable="false" />
        </button>
    );
}

function PopupHeader({ onClose }: { onClose?: () => void }) {
    return (
        <div className="flex w-full items-center justify-end">
            <PopupCloseButton onClick={onClose} />
        </div>
    );
}

function PopupTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="whitespace-pre-line text-grayscale-800 type-heading-7">{children}</h2>;
}

function PopupActions({ actions }: { actions: PopupAction[] }) {
    return (
        <div className="flex w-full items-center gap-2">
            {actions.map((action) => (
                <PopupActionButton action={action} key={action.label} />
            ))}
        </div>
    );
}

function PopupActionButton({ action }: { action: PopupAction }) {
    const tone = action.tone ?? "primary";

    return (
        <button
            className={mergeClasses(
                "flex h-16 flex-1 items-center justify-center rounded-[16px] px-5 text-center type-heading-9",
                tone === "primary" && "bg-primary-400 text-white hover:bg-primary-500",
                tone === "secondary" && "bg-grayscale-50 text-grayscale-600 hover:bg-grayscale-100",
                tone === "danger" && "bg-[#f8eeef] text-[#e65555] hover:bg-[#f4e4e5]",
                action.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
            )}
            disabled={action.disabled}
            onClick={action.onClick}
            type="button"
        >
            {action.label}
        </button>
    );
}

function StaticIcon({
    alt = "",
    className,
    size = 24,
    src,
}: {
    alt?: string;
    className?: string;
    size?: number;
    src: string;
}) {
    return (
        <Image
            alt={alt}
            aria-hidden={alt ? undefined : true}
            className={mergeClasses("shrink-0", className)}
            height={size}
            src={src}
            width={size}
        />
    );
}

function CheckBadge({ size = 80 }: { size?: number }) {
    return (
        <span
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-400 text-white"
            style={{ height: size, width: size }}
        >
            <CheckIcon aria-hidden className="size-11" focusable="false" />
        </span>
    );
}

function NoticeCard({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="flex w-full flex-col gap-4 rounded-[16px] bg-[#f8f9fa] p-6">
            <div className="flex items-center gap-1 text-grayscale-700 type-body-6">
                <StaticIcon size={20} src="/icon/24dp/important.svg" />
                {title}
            </div>
            <div className="text-grayscale-600 type-body-3">{children}</div>
        </div>
    );
}

function FieldDisplay({
    error,
    label,
    placeholder,
    suffix,
    value,
}: {
    error?: string;
    label: string;
    placeholder: string;
    suffix?: React.ReactNode;
    value?: string;
}) {
    return (
        <div className="flex w-full flex-col gap-2">
            <span className="text-grayscale-700 type-body-3">{label}</span>
            <div className="flex w-full flex-col gap-2">
                <div className="flex h-12 w-full items-center justify-between rounded-[8px] border border-grayscale-200 bg-white px-3">
                    <span
                        className={mergeClasses(
                            "min-w-0 truncate type-body-3",
                            value ? "text-grayscale-700" : "text-grayscale-500",
                        )}
                    >
                        {value || placeholder}
                    </span>
                    {suffix}
                </div>
                {error && <p className="pl-2 text-[#e65555] type-body-8">{error}</p>}
            </div>
        </div>
    );
}

export type BasicPopupProps = React.HTMLAttributes<HTMLDivElement> & {
    description?: string;
    onClose?: () => void;
    primaryAction?: PopupAction;
    secondaryAction?: PopupAction;
    title?: string;
};

export function BasicPopup({
    className,
    description = "서브텍스트",
    onClose,
    primaryAction = { label: "확인" },
    secondaryAction,
    title = "타이틀",
    ...props
}: BasicPopupProps) {
    const actions = secondaryAction
        ? [{ tone: "secondary" as const, ...secondaryAction }, primaryAction]
        : [primaryAction];

    return (
        <PopupShell
            className={className}
            footer={<PopupActions actions={actions} />}
            width="basic"
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                <PopupHeader onClose={onClose} />
                <div className="flex w-full flex-col items-center gap-[30px]">
                    <div className="flex w-full flex-col items-center gap-4 text-center">
                        <CheckBadge />
                        <div className="flex w-full flex-col gap-2 text-center">
                            <h2 className="text-grayscale-800 type-heading-7">{title}</h2>
                            <p className="text-grayscale-600 type-body-3">{description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </PopupShell>
    );
}

export type AlarmPopupProps = React.HTMLAttributes<HTMLDivElement> & {
    enabled?: boolean;
    onClose?: () => void;
    primaryDisabled?: boolean;
};

export function AlarmPopup({
    className,
    enabled = false,
    onClose,
    primaryDisabled = !enabled,
    ...props
}: AlarmPopupProps) {
    return (
        <PopupShell
            className={className}
            footer={
                <PopupActions
                    actions={[
                        { label: "다음에 하기", tone: "secondary" },
                        { label: "알림 설정", disabled: primaryDisabled },
                    ]}
                />
            }
            width="sm"
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                <PopupHeader onClose={onClose} />
                <div className="flex w-full flex-col gap-6">
                    <PopupTitle>{"이 공고 놓치는 일 없게,\n메이트가 미리 알려드릴게요!"}</PopupTitle>
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex w-full items-start justify-between">
                            <span className="text-grayscale-700 type-body-1">공고 알림받기</span>
                            <Toggle ariaLabel="공고 알림받기" checked={enabled} />
                        </div>
                        <div className="flex w-full flex-col gap-2">
                            <div className="rounded-[12px] bg-grayscale-50 p-4">
                                <div className="flex w-full items-start gap-4">
                                    <AlarmFeature icon="/icon/24dp/fix.svg" label="정정" />
                                    <AlarmFeature icon="/icon/24dp/siren.svg" label="마감" />
                                    <AlarmFeature icon="/icon/24dp/gold_trophy.svg" label="개찰완료" />
                                </div>
                            </div>
                            <ul className="list-disc pl-5 text-grayscale-600 type-body-7">
                                <li>알림이 오지 않는다면 마이페이지 &gt; 알림설정을 확인해 주세요.</li>
                                <li>나의 알림에서 모든 알림 관리가 가능합니다.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </PopupShell>
    );
}

function AlarmFeature({ icon, label }: { icon: string; label: string }) {
    return (
        <div className="flex flex-1 items-center justify-center gap-1 text-grayscale-700 type-body-2">
            <StaticIcon size={24} src={icon} />
            {label}
        </div>
    );
}

export type CorrectionPopupProps = React.HTMLAttributes<HTMLDivElement> & {
    items?: Array<{ id: string; title: string; date: string }>;
    onClose?: () => void;
    selectedId?: string;
};

const defaultCorrectionItems = [
    { id: "third", title: "3차 정정 공고", date: "2026.05.27" },
    { id: "second", title: "2차 정정 공고", date: "2026.05.24" },
    { id: "first", title: "1차 정정 공고", date: "2026.05.22" },
    { id: "origin", title: "최초공고", date: "2026.05.21" },
];

export function CorrectionPopup({
    className,
    items = defaultCorrectionItems,
    onClose,
    selectedId = "third",
    ...props
}: CorrectionPopupProps) {
    const hasSelection = Boolean(selectedId);

    return (
        <PopupShell
            className={className}
            footer={
                <PopupActions
                    actions={[
                        { label: "닫기", tone: "secondary" },
                        { label: "공고 확인하기", disabled: !hasSelection },
                    ]}
                />
            }
            width="sm"
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                <PopupHeader onClose={onClose} />
                <div className="flex w-full flex-col gap-6">
                    <PopupTitle>{"변경되기 전,\n공고들을 모아뒀어요!"}</PopupTitle>
                    <div className="h-[260px] overflow-hidden rounded-[12px] bg-grayscale-50 p-4">
                        <div className="flex flex-col gap-2">
                            {items.map((item) => (
                                <div
                                    className="flex h-14 w-full items-center justify-between rounded-[8px] bg-white p-4 shadow-[0_0_12px_#f1f3f5]"
                                    key={item.id}
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckboxCircle
                                            active={item.id === selectedId}
                                            ariaLabel={`${item.title} 선택`}
                                        />
                                        <span className="text-grayscale-800 type-body-2">{item.title}</span>
                                    </div>
                                    <span className="text-grayscale-800 type-body-7">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PopupShell>
    );
}

export type UploadPopupProps = React.HTMLAttributes<HTMLDivElement> & {
    file?: {
        name: string;
        size: string;
    };
    onClose?: () => void;
};

export function UploadPopup({
    className,
    file,
    onClose,
    ...props
}: UploadPopupProps) {
    const ready = Boolean(file);

    return (
        <PopupShell
            className={className}
            footer={
                <PopupActions
                    actions={[
                        { label: "닫기", tone: "secondary" },
                        { label: "업로드 하기", disabled: !ready },
                    ]}
                />
            }
            width="md"
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                <PopupHeader onClose={onClose} />
                <div className="flex w-full flex-col gap-4">
                    <div className="rounded-[12px] bg-primary-100 p-5 text-primary-400 type-body-2">
                        조회된 정보와 일치하는지, 직인이 잘 보이는지 마지막으로 확인해 주세요!
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <UploadDropzone file={file} />
                    </div>
                    <NoticeCard title="확인해주세요!">
                        <div className="flex flex-col gap-4">
                            <ChecklistItem
                                description="- 정보가 바뀌었다면 최신본이 필요해요!"
                                title="최근에 발급받은 서류인가요?"
                            />
                            <ChecklistItem
                                description="- 귀퉁이가 잘리면 승인이 어려워요."
                                title="서류의 모든 면이 다 보이나요?"
                            />
                            <ChecklistItem
                                description="- 글자가 흐리면 확인이 어려워요."
                                title="글자가 흐릿하지 않고 선명한가요?"
                            />
                            <ChecklistItem
                                description="- 다른 확장명은 업로드가 되지않을 수 있어요!"
                                title="가급적 스캔한 PDF 파일을 추천드려요."
                            />
                        </div>
                    </NoticeCard>
                </div>
            </div>
        </PopupShell>
    );
}

function UploadDropzone({ file }: Pick<UploadPopupProps, "file">) {
    if (!file) {
        return (
            <div className="flex w-full flex-col items-center rounded-[16px] border border-dashed border-grayscale-200 bg-grayscale-50 px-6 py-20 text-center">
                <div className="flex w-full flex-col items-center gap-6 px-20">
                    <div className="flex w-[292px] flex-col items-center gap-1">
                        <p className="text-grayscale-700 type-body-1">파일을 여기에 드롭하거나 클릭하여 선택하세요</p>
                        <p className="text-grayscale-600 type-body-7">PDF, JPG, PNG 파일만 업로드 가능 (최대 10MB)</p>
                    </div>
                    <button
                        className="rounded-[8px] bg-primary-400 px-4 py-2 text-white type-body-2"
                        type="button"
                    >
                        파일 선택
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[290px] w-full flex-col justify-center rounded-[16px] border border-dashed border-grayscale-200 bg-grayscale-50 p-6">
            <div className="flex flex-1 flex-col gap-5">
                <div className="rounded-[8px] bg-white p-4 shadow-[0_0_12px_#f1f3f5]">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-start gap-5">
                            <span className="size-10 rounded-[8px] bg-primary-300" />
                            <div className="w-[249px]">
                                <p className="truncate text-grayscale-800 type-body-2">{file.name}</p>
                                <p className="text-grayscale-600 type-body-7">{file.size}</p>
                            </div>
                        </div>
                        <CloseIcon aria-hidden className="size-6 text-grayscale-700" focusable="false" />
                    </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-1 px-20 text-center">
                    <CheckBadge size={36} />
                    <p className="text-grayscale-700 type-body-1">
                        서류 확인 준비 완료!
                        <br />
                        이제 1초 만에 회사 정보를 불러올게요.
                    </p>
                </div>
            </div>
        </div>
    );
}

function ChecklistItem({ description, title }: { description: string; title: string }) {
    return (
        <div className="flex items-start gap-1">
            <StaticIcon size={16} src="/icon/24dp/state.svg" />
            <div className="flex flex-col">
                <span className="text-grayscale-700 type-body-7">{title}</span>
                <span className="text-grayscale-600 type-caption-2">{description}</span>
            </div>
        </div>
    );
}

export type PasswordPopupState = "empty" | "filled" | "visible" | "error";

export type PasswordPopupProps = React.HTMLAttributes<HTMLDivElement> & {
    onClose?: () => void;
    state?: PasswordPopupState;
};

export function PasswordPopup({
    className,
    onClose,
    state = "empty",
    ...props
}: PasswordPopupProps) {
    const filled = state !== "empty";
    const visible = state === "visible" || state === "error";
    const error = state === "error";
    const disabled = state === "empty" || error;

    return (
        <PopupShell
            className={className}
            footer={<PopupActions actions={[{ label: "변경하기", disabled }]} />}
            width="md"
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                <PopupHeader onClose={onClose} />
                <div className="flex w-full flex-col gap-6">
                    <PopupTitle>{"새로운 비밀번호를\n입력해주세요!"}</PopupTitle>
                    <div className="flex w-full flex-col gap-4">
                        <FieldDisplay
                            error={error ? "비밀번호를 확인해 주세요!" : undefined}
                            label="현재 비밀번호"
                            placeholder="지금 쓰고 있는 비밀번호를 입력해주세요."
                            value={filled ? "********" : undefined}
                        />
                        <FieldDisplay
                            error={error ? "8 ~ 16자리 이내, 영문, 숫자 포함 새로 사용할 비밀번호를 입력해주세요!" : undefined}
                            label="새 비밀번호"
                            placeholder="비밀번호를 입력해 주세요. (8 ~ 16자리 이내, 영문, 숫자 포함)"
                            value={filled ? "********" : undefined}
                        />
                        <FieldDisplay
                            error={error ? "비밀번호를 다시 확인해 주세요!" : undefined}
                            label="새 비밀번호 확인"
                            placeholder="비밀번호를 한 번 더 입력해주세요."
                            suffix={
                                visible ? (
                                    <span className="text-grayscale-600 type-body-7">보기</span>
                                ) : undefined
                            }
                            value={visible ? "kig9289" : filled ? "********" : undefined}
                        />
                    </div>
                </div>
            </div>
        </PopupShell>
    );
}

export type WithdrawalConfirmPopupProps = React.HTMLAttributes<HTMLDivElement> & {
    checked?: boolean;
    onClose?: () => void;
};

export function WithdrawalConfirmPopup({
    checked = false,
    className,
    onClose,
    ...props
}: WithdrawalConfirmPopupProps) {
    return (
        <PopupShell
            className={className}
            footer={
                <PopupActions
                    actions={[
                        { label: "탈퇴하기", tone: "danger" },
                        { label: "계속 이용하기", disabled: !checked },
                    ]}
                />
            }
            width="sm"
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                <PopupHeader onClose={onClose} />
                <div className="flex w-full flex-col gap-6">
                    <PopupTitle>{"사장님! 메이트 탈퇴를\n원하시나요?"}</PopupTitle>
                    <NoticeCard title="탈퇴 전 확인해주세요!">
                        <ul className="list-disc pl-6">
                            <li>마이페이지 내 회원님의 모든 정보가 삭제돼요.</li>
                            <li>탈퇴 시 모든 데이터는 복구가 불가능합니다.</li>
                        </ul>
                    </NoticeCard>
                    <label className="flex items-center gap-2 text-grayscale-700 type-body-3">
                        <CheckboxSquare ariaLabel="상기 내용 확인" checked={checked} />
                        상기 내용을 확인했습니다.
                    </label>
                </div>
            </div>
        </PopupShell>
    );
}

export type WithdrawalEmailPopupStep =
    | "email"
    | "emailSent"
    | "emailError"
    | "codeReady"
    | "codeInput"
    | "codeError"
    | "codeVerified";

export type WithdrawalEmailPopupProps = React.HTMLAttributes<HTMLDivElement> & {
    code?: string;
    email?: string;
    onClose?: () => void;
    remainingTime?: string;
    step?: WithdrawalEmailPopupStep;
};

export function WithdrawalEmailPopup({
    className,
    code = "4878",
    email,
    onClose,
    remainingTime = "02 :59",
    step = "email",
    ...props
}: WithdrawalEmailPopupProps) {
    const codeStep = step.startsWith("code");
    const verified = step === "codeVerified";
    const primaryEnabled = step === "emailSent" || verified;

    return (
        <PopupShell
            className={className}
            footer={
                <PopupActions
                    actions={[
                        {
                            label: codeStep ? "인증하기" : "인증번호 보내기",
                            disabled: !primaryEnabled,
                        },
                    ]}
                />
            }
            width={codeStep ? "sm" : "md"}
            {...props}
        >
            <div className="flex w-full flex-col gap-2.5">
                <PopupHeader onClose={onClose} />
                <div className="flex w-full flex-col gap-6">
                    <PopupTitle>
                        {codeStep
                            ? "메일로 보낸 인증번호\n4자리를 입력해 주세요!"
                            : "알림 받을 사장님의\n이메일을 적어주세요!"}
                    </PopupTitle>
                    {codeStep ? (
                        <VerificationCodePanel
                            code={step === "codeReady" ? "" : code}
                            error={step === "codeError"}
                            remainingTime={remainingTime}
                            verified={verified}
                        />
                    ) : (
                        <FieldDisplay
                            error={step === "emailError" ? "이메일 주소를 다시 확인해 주세요!" : undefined}
                            label="이메일"
                            placeholder="알림 받을 이메일 주소 입력해 주세요."
                            suffix={email ? <CloseIcon aria-hidden className="size-5 text-grayscale-600" focusable="false" /> : undefined}
                            value={email}
                        />
                    )}
                </div>
            </div>
        </PopupShell>
    );
}

function VerificationCodePanel({
    code,
    error,
    remainingTime,
    verified,
}: {
    code: string;
    error?: boolean;
    remainingTime: string;
    verified?: boolean;
}) {
    const digits = code.padEnd(4, "0").slice(0, 4).split("");

    return (
        <div className="flex w-full flex-col gap-2">
            <p className="text-grayscale-600 type-body-3">
                입력하신 메일 주소로 인증번호를 보내드렸어요!
            </p>
            <div className="flex w-full flex-col gap-2">
                <div className="flex w-full gap-2">
                    {digits.map((digit, index) => (
                        <div
                            className="flex h-24 flex-1 items-center justify-center rounded-[16px] border border-grayscale-200 bg-white text-center text-grayscale-700 type-heading-3"
                            key={`${digit}-${index}`}
                        >
                            <span className={code || verified ? "" : "opacity-0"}>{digit}</span>
                        </div>
                    ))}
                </div>
                <div className="flex w-full items-start justify-between pl-2">
                    <p className={mergeClasses("text-[#e65555] type-body-8", error ? "" : "opacity-0")}>
                        인증번호를 다시 확인해 주세요!
                    </p>
                    <span className="text-primary-400 type-body-6">{remainingTime}</span>
                </div>
            </div>
            <div className="flex w-full justify-center pt-4 text-center text-grayscale-600 type-body-7">
                인증번호가 안 오나요?&nbsp;
                <button className="underline" type="button">
                    재전송
                </button>
            </div>
        </div>
    );
}
