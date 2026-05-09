"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { CampaignCard } from "@/components/CampaignCard";
import { CampaignImage } from "@/components/CampaignImage";
import { DonationButton } from "@/components/DonationButton";
import { LearningFundPlan } from "@/components/LearningFundPlan";
import { ProgressBar } from "@/components/ProgressBar";
import { PublicHeader } from "@/components/PublicHeader";
import { campaigns as seededCampaigns, schoolProfile } from "@/data/campaigns";
import { formatCurrency, sortCampaignsLatestFirst } from "@/lib/campaigns";
import { loadCampaignsFromBrowser } from "@/lib/localCampaignStorage";
import type { Campaign } from "@/types/campaign";

type PublicView = "all" | "campaigns" | "events";

export default function PublicPortalPage() {
  const [campaigns, setCampaigns] = useState(seededCampaigns);
  const [activeView, setActiveView] = useState<PublicView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const activeCampaigns = useMemo(() => getActiveCampaigns(campaigns), [campaigns]);
  const activeEvents = useMemo(() => getActiveEvents(campaigns), [campaigns]);
  const activeItems = useMemo(
    () => sortCampaignsLatestFirst([...activeCampaigns, ...activeEvents]),
    [activeCampaigns, activeEvents]
  );
  const featuredCampaign = useMemo(() => getFeaturedCampaign(campaigns), [campaigns]);
  const visibleItems = useMemo(
    () =>
      searchCampaigns(
        activeView === "all" ? activeItems : activeView === "campaigns" ? activeCampaigns : activeEvents,
        searchQuery
      ),
    [activeCampaigns, activeEvents, activeItems, activeView, searchQuery]
  );
  const searchLabel =
    activeView === "all" ? "Search all campaigns and events" : `Search ${activeView}`;

  useEffect(() => {
    const savedCampaigns = loadCampaignsFromBrowser(seededCampaigns);
    if (savedCampaigns) {
      setCampaigns(savedCampaigns);
    }
  }, []);

  return (
    <>
      <PublicHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
          <div className="relative flex flex-col justify-center">
            <p className="w-fit rounded-full bg-sunshine px-3 py-1 text-sm font-bold uppercase tracking-[0.18em] text-ink">
              PTA Fundraising Hub
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              <span className="text-coral">{schoolProfile.schoolName}</span> fundraising, gathered in one trusted place.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
              {schoolProfile.tagline} Campaign pages show progress and details, while every
              giving action links out to {schoolProfile.paymentSystemName}.
            </p>
          </div>
          <article className="overflow-hidden rounded-3xl border border-white/70 bg-white/82 shadow-joyful backdrop-blur">
            <CampaignImage campaign={featuredCampaign} className="aspect-[16/10] w-full bg-white" />
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-black">{featuredCampaign.title}</h2>
              <div className="space-y-2">
                <ProgressBar campaign={featuredCampaign} />
                <p className="text-sm font-semibold text-ink/68">
                  {formatCurrency(featuredCampaign.amountRaised)} collected of{" "}
                  {formatCurrency(featuredCampaign.goalAmount)} goal
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <DonationButton
                  url={featuredCampaign.externalDonationUrl}
                  label={featuredCampaign.externalActionLabel}
                />
                <Link
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-sky/40 bg-sky/15 px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-sky hover:text-white"
                  href={`/campaigns/${featuredCampaign.slug}`}
                >
                  View details
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <LearningFundPlan />
        </section>

        <div className="border-t border-coral/15" />

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="campaigns">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">
                {activeView === "all" ? "All" : activeView === "campaigns" ? "Campaigns" : "Events"}
              </p>
              <h2 className="mt-2 text-3xl font-black">Ways to support right now</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block w-full sm:w-80">
                <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/42" />
                <input
                  className="field-control mt-0 rounded-full py-3 pl-16"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchLabel}
                  style={{ paddingLeft: "3.25rem" }}
                  type="text"
                  value={searchQuery}
                />
              </label>
              <div className="inline-flex w-fit rounded-full border border-white/70 bg-white/82 p-1.5 shadow-soft backdrop-blur">
                <button
                  className={`focus-ring rounded-full px-5 py-2 text-sm font-bold transition ${
                    activeView === "all" ? "bg-coral text-white shadow-sm" : "text-ink/68 hover:bg-sunshine/45"
                  }`}
                  onClick={() => setActiveView("all")}
                  type="button"
                >
                  All
                </button>
                <button
                  className={`focus-ring rounded-full px-5 py-2 text-sm font-bold transition ${
                    activeView === "campaigns" ? "bg-coral text-white shadow-sm" : "text-ink/68 hover:bg-sunshine/45"
                  }`}
                  onClick={() => setActiveView("campaigns")}
                  type="button"
                >
                  Campaigns
                </button>
                <button
                  className={`focus-ring rounded-full px-5 py-2 text-sm font-bold transition ${
                    activeView === "events" ? "bg-coral text-white shadow-sm" : "text-ink/68 hover:bg-sunshine/45"
                  }`}
                  onClick={() => setActiveView("events")}
                  type="button"
                >
                  Events
                </button>
              </div>
            </div>
          </div>
          {visibleItems.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {visibleItems.map((campaign) => (
              <CampaignCard
                campaign={campaign}
                key={campaign.id}
                showProgress={!isParticipationEvent(campaign)}
              />
            ))}
          </div>
          ) : (
            <div className="rounded-3xl border border-white/70 bg-white/82 p-8 text-center shadow-soft">
              <p className="text-lg font-black">No {activeView === "all" ? "items" : activeView} found</p>
              <p className="mt-2 text-sm text-ink/62">Try another keyword or clear the search.</p>
            </div>
          )}
        </section>

      </main>
    </>
  );
}

function searchCampaigns(campaigns: Campaign[], query: string): Campaign[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return campaigns;
  }

  return campaigns.filter((campaign) =>
    [
      campaign.title,
      campaign.type,
      campaign.shortDescription,
      campaign.fullDescription,
      campaign.supports,
      campaign.restaurant?.restaurantName,
      campaign.restaurant?.location,
      campaign.restaurant?.instructions
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );
}

function getActiveCampaigns(campaigns: Campaign[]): Campaign[] {
  return sortCampaignsLatestFirst(
    campaigns.filter((campaign) => campaign.status !== "draft" && !campaign.featured && !isParticipationEvent(campaign))
  );
}

function getActiveEvents(campaigns: Campaign[]): Campaign[] {
  return sortCampaignsLatestFirst(
    campaigns.filter(
      (campaign) => campaign.status !== "draft" && !campaign.featured && isParticipationEvent(campaign)
    )
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

function getFeaturedCampaign(campaigns: Campaign[]): Campaign {
  return (
    campaigns.find((campaign) => campaign.featured && campaign.status === "active") ??
    getActiveCampaigns(campaigns)[0] ??
    campaigns[0]
  );
}
