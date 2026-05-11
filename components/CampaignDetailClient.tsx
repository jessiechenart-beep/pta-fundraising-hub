"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Gift,
  HeartHandshake,
  Mail,
  type LucideIcon,
  Palette,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import { CampaignImage } from "@/components/CampaignImage";
import { DonationButton } from "@/components/DonationButton";
import { ProgressBar } from "@/components/ProgressBar";
import { PublicHeader } from "@/components/PublicHeader";
import { RestaurantPanel, RestaurantReceiptReport } from "@/components/RestaurantPanel";
import { RichText } from "@/components/RichText";
import { StatusPill } from "@/components/StatusPill";
import { formatCurrency, formatDate } from "@/lib/campaigns";
import { loadCampaignsFromBrowser } from "@/lib/localCampaignStorage";
import type { Campaign } from "@/types/campaign";

export function CampaignDetailClient({
  initialCampaigns,
  slug
}: {
  initialCampaigns: Campaign[];
  slug: string;
}) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const campaign = useMemo(
    () => campaigns.find((item) => item.slug === slug),
    [campaigns, slug]
  );

  useEffect(() => {
    const savedCampaigns = loadCampaignsFromBrowser(initialCampaigns);
    if (savedCampaigns) {
      setCampaigns(savedCampaigns);
    }
  }, []);

  if (!campaign) {
    return (
      <>
        <PublicHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Link className="focus-ring inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold" href="/">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Back to portal
          </Link>
          <h1 className="mt-8 text-3xl font-black">Campaign not found</h1>
          <p className="mt-3 leading-7 text-ink/70">
            This campaign is not available in the current local campaign list.
          </p>
        </main>
      </>
    );
  }

  if (campaign.slug === "learning-fund-donation") {
    return <LearningFundDetail campaign={campaign} />;
  }

  return (
    <>
      <PublicHeader />
      <main>
        <section>
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-start lg:gap-2 lg:px-8 lg:py-14">
            <div className="w-full max-w-sm">
              <CampaignImage
                campaign={campaign}
                className="aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/70 shadow-joyful"
              />
            </div>
            <div className="max-w-3xl lg:pt-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-meadow">{campaign.type}</span>
                <StatusPill status={campaign.status} />
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{campaign.title}</h1>
              <HeroActionPanel campaign={campaign} />
              <RichText className="mt-7 text-lg leading-8 text-ink/76" text={campaign.fullDescription} />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <DonationButton
                  url={campaign.externalDonationUrl}
                  label={campaign.externalActionLabel ?? "Open official link"}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.68fr_0.32fr] lg:px-8">
          <div className="space-y-6">
            <RestaurantPanel campaign={campaign} />
            <ReminderSignup campaignId={campaign.id} campaignTitle={campaign.title} />
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-meadow">What this funds</p>
              <h2 className="mt-2 text-3xl font-black">Support focus</h2>
              <p className="mt-4 text-lg leading-8 text-ink/76">{campaign.supports}</p>
            </section>
            <RestaurantReceiptReport campaign={campaign} />
          </aside>
        </section>
      </main>
    </>
  );
}

const learningFundHighlights = [
  {
    icon: BookOpen,
    title: "Full-Time Librarian",
    copy: "Keeps students connected to books, research skills, and a welcoming library program."
  },
  {
    icon: Users,
    title: "Reading & Math Specialists",
    copy: "Provides small-group academic support where students need extra practice or challenge."
  },
  {
    icon: HeartHandshake,
    title: "Social Emotional Counselor",
    copy: "Supports student well-being, friendships, classroom readiness, and positive school culture."
  },
  {
    icon: Palette,
    title: "Certificated Art Teacher",
    copy: "Gives students dedicated art instruction and creative expression across the school year."
  },
  {
    icon: Sparkles,
    title: "Classroom Resources",
    copy: "Funds digital subscriptions used in classrooms and learning tools teachers rely on."
  },
  {
    icon: Gift,
    title: "Experiences & Teachers",
    copy: "Supports on and off-site field trips plus professional development for teachers."
  }
];

function HeroActionPanel({ campaign }: { campaign: Campaign }) {
  const showProgress = !isParticipationEvent(campaign);

  return (
    <section className="mt-6">
      <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
        <InfoRow icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Starts" value={formatDate(campaign.startDate)} />
        <InfoRow icon={<Target aria-hidden className="h-4 w-4" />} label="Deadline" value={formatDate(campaign.deadline)} />
      </div>
      {showProgress ? (
        <div className="mt-5 max-w-2xl">
          <div className="mb-3 flex items-end justify-between gap-3">
            <p className="text-3xl font-black">{formatCurrency(campaign.amountRaised)}</p>
            <p className="text-xl font-black text-ink/72">Goal {formatCurrency(campaign.goalAmount)}</p>
          </div>
          <ProgressBar campaign={campaign} />
        </div>
      ) : null}
    </section>
  );
}

function isParticipationEvent(campaign: Campaign): boolean {
  if (campaign.category) {
    return campaign.category === "event";
  }

  return (
    campaign.id === "teacher-staff-appreciation-week" ||
    campaign.id.startsWith("event-") ||
    (campaign.id !== "fifth-grade-gift" &&
      campaign.externalActionLabel?.toLowerCase().includes("sign up") === true)
  );
}

function LearningFundDetail({ campaign }: { campaign: Campaign }) {
  return (
    <>
      <PublicHeader />
      <main>
        <section>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-meadow">{campaign.type}</span>
                  <StatusPill status={campaign.status} />
                </div>
                <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{campaign.title}</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/76">
                  The Learning Fund closes the gap between public funding and the enriched education
                  Quail Run families want for every student.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <DonationButton url={campaign.externalDonationUrl} label={campaign.externalActionLabel} />
                </div>
              </div>
              <SuggestedDonationCard />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr]">
            <div className="space-y-6">
              <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-meadow">What your gift supports</p>
                <h2 className="mt-2 text-3xl font-black">A full-school support system</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {learningFundHighlights.map((item) => (
                    <SupportCard key={item.title} {...item} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-meadow">Progress</p>
                <p className="mt-3 text-4xl font-black">{formatCurrency(campaign.amountRaised)}</p>
                <p className="mt-1 text-sm text-ink/62">of {formatCurrency(campaign.goalAmount)} annual goal</p>
                <div className="mt-5">
                  <ProgressBar campaign={campaign} />
                </div>
                <div className="mt-6 grid gap-3">
                  <InfoRow icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Starts" value={formatDate(campaign.startDate)} />
                  <InfoRow icon={<Target aria-hidden className="h-4 w-4" />} label="Deadline" value={formatDate(campaign.deadline)} />
                </div>
                <div className="mt-6">
                  <DonationButton url={campaign.externalDonationUrl} label={campaign.externalActionLabel} />
                </div>
              </section>

              <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-meadow">Why it matters</p>
                <div className="mt-4 space-y-4 text-sm leading-6 text-ink/72">
                  <p>
                    State and federal funding is not enough to maintain Quail Run’s high standard
                    of education. Family donations, corporate matching, and sponsorships help close
                    that gap.
                  </p>
                  <p>
                    Quail Run is a Gold Ribbon School and a California Pivotal Practice School.
                  </p>
                  <p className="font-bold text-ink">
                    Ask your company to double your impact with corporate match.
                  </p>
                </div>
                <a
                  className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-meadow px-4 py-3 text-sm font-bold text-white transition hover:bg-ink"
                  href={campaign.externalDonationUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Employer Match
                  <ExternalLink aria-hidden className="h-4 w-4" />
                </a>
              </section>
            </aside>
          </div>

        </section>
      </main>
    </>
  );
}

function SuggestedDonationCard() {
  return (
    <article className="rounded-lg border border-white/14 bg-white p-6 text-ink shadow-soft">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-meadow">Suggested donation</p>
      <div className="mt-4 flex items-end gap-3">
        <p className="text-7xl font-black leading-none text-meadow">$675</p>
        <p className="pb-2 text-lg font-black text-ink/68">per student</p>
      </div>
      <p className="mt-5 text-sm font-semibold leading-6 text-ink/68">
        Recommended during First Step registration to help fund the full-school support system.
      </p>
    </article>
  );
}

function SupportCard({
  copy,
  icon: Icon,
  title
}: {
  copy: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-ink/10 bg-linen p-5">
      <span className="grid h-11 w-11 place-items-center rounded-md bg-meadow text-white">
        <Icon aria-hidden className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/68">{copy}</p>
    </article>
  );
}

function ReminderSignup({
  campaignId,
  campaignTitle
}: {
  campaignId: string;
  campaignTitle: string;
}) {
  const storageKey = `pta-reminders-${campaignId}`;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [signupCount, setSignupCount] = useState(0);
  const [signupNames, setSignupNames] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedSignups = window.localStorage.getItem(storageKey);
    const signups = savedSignups ? JSON.parse(savedSignups) : [];
    setSignupCount(signups.length);
    setSignupNames(signups.map((signup: { name?: string; email?: string }) => signup.name || signup.email || "Parent"));
  }, [storageKey]);

  function saveReminder() {
    if (!email.trim()) {
      setMessage("Please add an email address.");
      return;
    }

    const savedSignups = window.localStorage.getItem(storageKey);
    const existingSignups = savedSignups ? JSON.parse(savedSignups) : [];
    const parentName = name.trim() || "Parent";
    const nextSignups = [
      ...existingSignups,
      {
        id: `reminder-${Date.now()}`,
        campaignTitle,
        email: email.trim(),
        name: parentName,
        createdAt: new Date().toISOString()
      }
    ];

    window.localStorage.setItem(storageKey, JSON.stringify(nextSignups));
    setSignupCount(nextSignups.length);
    setSignupNames(nextSignups.map((signup: { name?: string; email?: string }) => signup.name || signup.email || "Parent"));
    setEmail("");
    setName("");
    setMessage("You are subscribed for reminders in this browser.");
  }

  const visibleNames = signupNames.slice(-5);
  const remainingCount = Math.max(0, signupCount - visibleNames.length);

  return (
    <section className="overflow-hidden rounded-3xl border border-coral/18 bg-white/92 shadow-joyful backdrop-blur">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-coral p-6 text-white">
          <div className="flex items-center gap-1.5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/18 text-white">
              <Mail aria-hidden className="h-7 w-7" />
            </span>
            <h2 className="text-3xl font-black leading-tight">Stay in the loop</h2>
          </div>

          <div className="mt-6 rounded-2xl bg-white/14 p-4">
            <div className="flex items-end gap-2">
              <p className="text-5xl font-black leading-none">{signupCount}</p>
              <p className="pb-1 text-sm font-bold text-white/78">parents opted-in</p>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex -space-x-2">
                {signupCount > 0 ? (
                  visibleNames.map((signupName, index) => (
                    <span
                      className="grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-meadow text-xs font-black text-white shadow-sm"
                      key={`${signupName}-${index}`}
                      title={signupName}
                    >
                      {getInitialsFromName(signupName)}
                    </span>
                  ))
                ) : (
                  [0, 1, 2, 3].map((item) => (
                    <span
                      className="grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-white/24 text-xs font-black text-white/70"
                      key={item}
                    >
                      {item === 0 ? "+" : ""}
                    </span>
                  ))
                )}
              </div>
              {remainingCount > 0 ? (
                <span className="ml-3 rounded-full bg-white px-3 py-1.5 text-xs font-black text-coral">
                  +{remainingCount} more
                </span>
              ) : (
                signupCount === 0 ? (
                  <span className="ml-3 text-xs font-bold text-white/76">be the first</span>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-3">
            <input
              className="field-control mt-0 rounded-2xl py-3"
              onChange={(event) => setName(event.target.value)}
              placeholder="Parent name"
              value={name}
            />
            <input
              className="field-control mt-0 rounded-2xl py-3"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              type="email"
              value={email}
            />
            <button
              className="focus-ring rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-meadow"
              onClick={saveReminder}
              type="button"
            >
              Subscribe for reminder
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/66">
            Parents can share an email for reminders about events or campaigns they want to participate in.
            This also helps PTA understand parent interest.
          </p>
          <p className="mt-3 text-xs leading-5 text-ink/54">
            MVP demo: opt-ins are stored in this browser. Connect this to a database and messaging tool before launch.
          </p>
        </div>
      </div>

      {message ? (
        <p className="mx-6 mb-6 rounded-2xl bg-meadow/10 px-3 py-2 text-sm font-semibold text-meadow">{message}</p>
      ) : null}
    </section>
  );
}

function getInitialsFromName(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm shadow-sm">
      <span className="inline-flex items-center gap-2 font-semibold">
        {icon}
        {label}
      </span>
      <span className="text-right text-ink/68">{value}</span>
    </div>
  );
}
