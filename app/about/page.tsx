"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { schoolProfile } from "@/data/campaigns";
import { defaultAboutContent, loadAboutContentFromBrowser, type PtaTeamMember } from "@/lib/aboutContent";

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState(defaultAboutContent);
  const [president, ...boardMembers] = aboutContent.team;

  useEffect(() => {
    setAboutContent(loadAboutContentFromBrowser());
  }, []);

  return (
    <>
      <PublicHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-14">
          <div>
            <p className="w-fit rounded-full bg-sunshine px-3 py-1 text-sm font-bold uppercase tracking-[0.18em] text-ink">
              About PTA
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              Community built by{" "}
              <span className="text-coral">families, teachers and volunteers.</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-ink/72">
              The PTA helps coordinate fundraising visibility, parent participation, and volunteer
              support so Quail Run students can enjoy richer classroom and school-wide experiences.
            </p>
          </div>
          <article className="overflow-hidden rounded-3xl border border-white/70 bg-white/88 shadow-joyful backdrop-blur">
            <div className="grid h-full gap-0 md:grid-cols-[0.42fr_0.58fr]">
              <img
                alt={`${aboutContent.principal.name} headshot`}
                className="h-full min-h-80 w-full object-cover"
                src={aboutContent.principal.image}
              />
              <div className="p-6">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">
                  Message from the principal
                </p>
                <h2 className="mt-3 text-3xl font-black">{aboutContent.principal.name}</h2>
                <p className="mt-1 text-sm font-bold text-meadow">{aboutContent.principal.title}</p>
                <p className="mt-5 text-lg leading-8 text-ink/74">{aboutContent.principal.message}</p>
              </div>
            </div>
          </article>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-coral/20" />
        </div>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black">2025-2026 PTA Board</h2>
            </div>
            <a
              className="focus-ring inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-meadow"
              href={`mailto:${aboutContent.contactEmail}`}
            >
              <Mail aria-hidden className="h-4 w-4" />
              Contact PTA
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {president ? <TeamCard featured member={president} /> : null}
            {boardMembers.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
          <div className="mt-12 border-t border-coral/20 pt-10">
            <h2 className="mb-4 text-3xl font-black">2025-2026 Committee Chairs</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {aboutContent.committeeChairs.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function TeamCard({
  featured = false,
  member
}: {
  featured?: boolean;
  member: PtaTeamMember;
}) {
  return (
    <article
      className={`group overflow-hidden rounded-3xl border bg-white/90 p-3 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:border-white hover:shadow-joyful ${
        featured ? "border-coral/45 ring-4 ring-coral/10" : "border-white/70"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-zinc-100">
        {member.image ? (
          <img
            alt={`${member.name} profile`}
            className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            src={member.image}
          />
        ) : (
          <span className="grid aspect-square w-full place-items-center bg-zinc-100 text-5xl font-black text-zinc-500">
            {member.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </span>
        )}
        {featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-coral px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white shadow-sm">
            President
          </span>
        ) : null}
      </div>
      <div className="px-2 py-4 text-center">
        <p className="text-xl font-black leading-tight">{member.name}</p>
        <p className="mt-2 text-sm font-bold leading-5 text-meadow">{member.role}</p>
      </div>
    </article>
  );
}
