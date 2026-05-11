"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, LayoutDashboard } from "lucide-react";
import { schoolProfile } from "@/data/campaigns";

const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "About PTA", href: "/about" }
];

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/72 shadow-[0_10px_40px_rgba(36,48,47,0.08)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] md:items-center lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-coral text-white shadow-[0_14px_30px_rgba(244,111,86,0.28)] rotate-[-3deg]">
            <HeartHandshake aria-hidden className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-coral">{schoolProfile.ptaName}</span>
            <span className="block truncate text-lg font-bold leading-tight">{schoolProfile.schoolName}</span>
          </span>
        </Link>
        <div className="flex items-center justify-between gap-3 md:contents">
          <nav className="flex min-w-0 items-center gap-5 sm:gap-7 md:justify-self-center" aria-label="Public sections">
            {publicNavItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : item.href.startsWith("/about") ? pathname === "/about" : false;

              return (
                <Link
                  className={`focus-ring whitespace-nowrap border-b-2 px-1 py-2 text-sm font-black transition ${
                    isActive
                      ? "border-coral text-ink"
                      : "border-transparent text-ink/58 hover:border-coral/35 hover:text-ink"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            className="focus-ring inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-honey/45 bg-sunshine/55 px-4 py-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-sunshine hover:shadow-soft md:justify-self-end"
            href="/admin"
          >
            <LayoutDashboard aria-hidden className="h-4 w-4" />
            PTA Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
