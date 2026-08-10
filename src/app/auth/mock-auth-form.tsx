"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setMockAuthenticated } from "@/lib/mock-auth";

type MockAuthFormProps = {
  readonly mode: "login" | "signup";
  readonly nextPath: string;
};

export function MockAuthForm({ mode, nextPath }: MockAuthFormProps) {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setMockAuthenticated();
    router.push(nextPath);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium">
        이메일
        <input
          className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          name="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </label>
      <label className="block text-sm font-medium">
        비밀번호
        <input
          className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          name="password"
          placeholder="비밀번호"
          required
          type="password"
        />
      </label>
      {mode === "signup" ? (
        <label className="block text-sm font-medium">
          회사명
          <input
            className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            name="company"
            placeholder="회사명"
            required
            type="text"
          />
        </label>
      ) : null}
      <Button className="h-11 w-full" type="submit">
        {mode === "signup" ? "회원가입" : "로그인"}
      </Button>
    </form>
  );
}
