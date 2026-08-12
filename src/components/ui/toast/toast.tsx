"use client";

import Image from "next/image";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

const DEFAULT_TOAST_DURATION = 3000;
const TOASTER_ID = "mate-toast";

let activeToastId: number | string | undefined;

export type ShowToastOptions = {
  duration?: number;
};

function ToastContent({ message }: { message: string }) {
  return (
    <div className="mx-auto flex min-h-14 w-fit max-w-[calc(100vw-32px)] items-center gap-2 rounded-2xl bg-grayscale-900 px-4 py-2.5 text-basic-white">
      <Image
        alt=""
        aria-hidden
        className="size-8 shrink-0"
        height={32}
        src="/icon/24dp/check_circle.svg"
        width={32}
      />
      <span className="min-w-0 type-heading-9">{message}</span>
    </div>
  );
}

function clearActiveToast(toastId: number | string) {
  if (activeToastId === toastId) {
    activeToastId = undefined;
  }
}

export function showToast(message: string, { duration = DEFAULT_TOAST_DURATION }: ShowToastOptions = {}) {
  if (activeToastId !== undefined) {
    sonnerToast.dismiss(activeToastId);
  }

  activeToastId = sonnerToast.custom(() => <ToastContent message={message} />, {
    duration,
    onAutoClose: (closedToast) => clearActiveToast(closedToast.id),
    onDismiss: (dismissedToast) => clearActiveToast(dismissedToast.id),
    toasterId: TOASTER_ID,
    unstyled: true,
  });
}

export function ToastViewport() {
  return (
    <SonnerToaster
      className="[--width:max-content]"
      closeButton={false}
      customAriaLabel="알림"
      duration={DEFAULT_TOAST_DURATION}
      expand={false}
      id={TOASTER_ID}
      mobileOffset={{ bottom: 50, left: 16, right: 16 }}
      offset={{ bottom: 50 }}
      position="bottom-center"
      swipeDirections={["bottom"]}
      toastOptions={{
        className: "data-[visible=false]:!opacity-0 data-[visible=false]:!transition-none",
        unstyled: true,
      }}
      visibleToasts={1}
    />
  );
}
