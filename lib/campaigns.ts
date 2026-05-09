import { campaigns } from "@/data/campaigns";
import type { Campaign, CampaignStatus } from "@/types/campaign";

export function getCampaigns(): Campaign[] {
  return campaigns;
}

export function getActiveCampaigns(): Campaign[] {
  return campaigns
    .filter((campaign) => campaign.status === "active")
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || compareCampaignsForDisplay(a, b));
}

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.slug === slug);
}

export function getFeaturedCampaign(): Campaign {
  return (
    campaigns.find((campaign) => campaign.featured && campaign.status === "active") ??
    getActiveCampaigns()[0] ??
    campaigns[0]
  );
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00`));
}

export function getProgressPercent(campaign: Pick<Campaign, "amountRaised" | "goalAmount">): number {
  if (campaign.goalAmount <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((campaign.amountRaised / campaign.goalAmount) * 100));
}

export function sortCampaignsLatestFirst<
  T extends Pick<Campaign, "deadline" | "startDate"> & { displayOrder?: number }
>(
  campaignsToSort: T[]
): T[] {
  return [...campaignsToSort].sort(compareCampaignsForDisplay);
}

function compareCampaignsForDisplay(
  a: Pick<Campaign, "deadline" | "startDate"> & { displayOrder?: number },
  b: Pick<Campaign, "deadline" | "startDate"> & { displayOrder?: number }
): number {
  if (typeof a.displayOrder === "number" || typeof b.displayOrder === "number") {
    return (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER);
  }

  return getCampaignSortTime(b) - getCampaignSortTime(a);
}

function getCampaignSortTime(campaign: Pick<Campaign, "deadline" | "startDate">): number {
  const date = campaign.startDate || campaign.deadline;
  return new Date(`${date}T12:00:00`).getTime();
}

export function getPublicCampaignStatus(
  campaign: Pick<Campaign, "deadline" | "status">
): CampaignStatus {
  if (campaign.status === "draft" || campaign.status === "ended") {
    return campaign.status;
  }

  const deadline = new Date(`${campaign.deadline}T23:59:59`);
  return deadline.getTime() < Date.now() ? "ended" : campaign.status;
}
