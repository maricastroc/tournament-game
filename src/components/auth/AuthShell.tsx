import type { ReactNode } from "react";
import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[420px] flex-col justify-center px-6 py-16">
      <div className="animate-fade-up">
        <Link
          href="/"
          aria-label="Gauntlet — home"
          className="mb-8 inline-block h-[38px] w-[38px] overflow-hidden rounded-[10px] shadow-[0_4px_14px_-4px_rgba(242,169,59,0.5)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" className="h-full w-full" />
        </Link>

        <p className="eyebrow text-amber">{eyebrow}</p>
        <h1 className="title-serif mt-2.5 text-[34px] leading-[1.05]">{title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{subtitle}</p>

        {children}
      </div>
    </main>
  );
}

export function AuthSubmit({ children, disabled }: { children: ReactNode; disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-1 flex w-full items-center justify-center gap-2 rounded-[11px] bg-amber px-4 py-3.5 text-[14px] font-bold text-[#1a1205] shadow-[0_8px_22px_-8px_rgba(242,169,59,0.6)] transition-all duration-150 enabled:hover:brightness-105 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
    >
      {children}
    </button>
  );
}
