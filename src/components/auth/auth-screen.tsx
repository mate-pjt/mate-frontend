import Link from "next/link";
import { StrokeLeftArrowIcon } from "@/components/icons";

export function AuthScreen({
  children,
  width = "wide",
}: {
  children: React.ReactNode;
  width?: "narrow" | "wide" | "start";
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(ellipse_at_bottom,_#bfd8fc_0%,_#f2f7ff_44%,_#eaf3fe_100%)] px-4 pb-12 pt-[104px] sm:px-6">
      <div className={`w-full ${width === "narrow" ? "max-w-[420px]" : width === "start" ? "max-w-[692px]" : "max-w-[640px]"}`}>
        {children}
      </div>
    </div>
  );
}

export function AuthCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] border border-grayscale-200 bg-white p-6 shadow-[0_0_20px_rgba(49,130,246,0.04)] ${className}`}>
      {children}
    </div>
  );
}

export function AuthBack({ href, onNavigate }: { href: string; onNavigate?: () => void }) {
  return (
    <Link className="mb-6 inline-flex items-start gap-2 rounded text-grayscale-600 type-body-3 hover:text-grayscale-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href={href} onNavigate={onNavigate}>
      <StrokeLeftArrowIcon aria-hidden className="size-4 shrink-0" />
      뒤로가기
    </Link>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded-lg bg-danger-surface px-3 py-2 text-danger type-body-7" role="alert">{message}</p>;
}
