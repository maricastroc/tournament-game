"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Rail() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="flex flex-row items-center gap-1.5 border-b border-line bg-linear-to-b from-white/2 to-transparent px-3.5 py-2.5 md:h-full md:flex-col md:border-b-0 md:border-r md:px-0 md:py-4"
    >
      <Link
        href="/"
        aria-label="Gauntlet — home"
        data-tooltip-id="app-tooltip"
        data-tooltip-content="Home"
        data-tooltip-place="right"
        className="mb-0 block h-8.5 w-8.5 overflow-hidden rounded-[9px] shadow-[0_4px_14px_-4px_rgba(242,169,59,0.5)] transition-transform duration-200 hover:scale-105 md:mb-3.5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.svg" alt="" className="h-full w-full" />
      </Link>

      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            data-tooltip-id="app-tooltip"
            data-tooltip-content={item.label}
            data-tooltip-place="right"
            className={[
              "grid h-10 w-10 place-items-center rounded-[10px] border transition-colors duration-200 [&_svg]:h-4.75 [&_svg]:w-4.75",
              active
                ? "border-amber-line bg-amber-soft text-amber-ink"
                : "border-transparent text-ink-mute hover:bg-white/3 hover:text-ink-dim",
            ].join(" ")}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
}
