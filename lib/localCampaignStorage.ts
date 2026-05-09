import type { Campaign } from "@/types/campaign";

export const CAMPAIGN_STORAGE_KEY = "pta-fundraising-hub-campaigns";
export const DELETED_CAMPAIGN_STORAGE_KEY = "pta-fundraising-hub-deleted-campaigns";

export function loadCampaignsFromBrowser(seedCampaigns?: Campaign[]): Campaign[] | null {
  const savedCampaigns = window.localStorage.getItem(CAMPAIGN_STORAGE_KEY);
  const deletedCampaignIds = new Set(loadDeletedCampaignIdsFromBrowser());
  if (!savedCampaigns && deletedCampaignIds.size === 0) {
    return null;
  }

  try {
    const parsedCampaigns = savedCampaigns ? (JSON.parse(savedCampaigns) as Campaign[]) : [];
    if (!Array.isArray(parsedCampaigns)) {
      return null;
    }

    if (!seedCampaigns) {
      return parsedCampaigns;
    }

    const seedWins = new Set([
      "learning-fund-donation",
      "quail-run-auction",
      "fifth-grade-gift",
      "direct-donation-placeholder"
    ]);
    const savedById = new Map(
      parsedCampaigns
        .map((campaign) => [campaign.id, campaign])
    );
    const seedIds = new Set(seedCampaigns.map((campaign) => campaign.id));
    const visibleSeedCampaigns = seedCampaigns.filter(
      (campaign) => !deletedCampaignIds.has(campaign.id)
    );
    const customCampaigns = parsedCampaigns.filter(
      (campaign) =>
        !seedIds.has(campaign.id) &&
        !deletedCampaignIds.has(campaign.id) &&
        (campaign.id.startsWith("campaign-") || campaign.id.startsWith("event-"))
    );

    const mergedCampaigns = [
      ...visibleSeedCampaigns.map((campaign) => {
        const savedCampaign = savedById.get(campaign.id);
        if (seedWins.has(campaign.id) || hasOutdatedSeedImage(savedCampaign)) {
          return {
            ...campaign,
            category: savedCampaign?.category ?? campaign.category,
            displayOrder: savedCampaign?.displayOrder ?? campaign.displayOrder,
            managerUserId: savedCampaign?.managerUserId ?? campaign.managerUserId
          };
        }

        return savedCampaign ?? campaign;
      }),
      ...customCampaigns
    ];

    const hasPublicContent = mergedCampaigns.some(
      (campaign) => campaign.status !== "draft" || campaign.featured
    );

    return hasPublicContent || deletedCampaignIds.size > 0 ? mergedCampaigns : seedCampaigns;
  } catch {
    window.localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
    return null;
  }
}

export function saveCampaignsToBrowser(campaigns: Campaign[]) {
  window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaigns));
}

export function loadDeletedCampaignIdsFromBrowser(): string[] {
  const savedDeletedCampaigns = window.localStorage.getItem(DELETED_CAMPAIGN_STORAGE_KEY);
  if (!savedDeletedCampaigns) {
    return [];
  }

  try {
    const parsedIds = JSON.parse(savedDeletedCampaigns) as string[];
    return Array.isArray(parsedIds) ? parsedIds.filter((id) => typeof id === "string") : [];
  } catch {
    window.localStorage.removeItem(DELETED_CAMPAIGN_STORAGE_KEY);
    return [];
  }
}

export function rememberDeletedCampaignId(campaignId: string) {
  const deletedCampaignIds = new Set(loadDeletedCampaignIdsFromBrowser());
  deletedCampaignIds.add(campaignId);
  window.localStorage.setItem(
    DELETED_CAMPAIGN_STORAGE_KEY,
    JSON.stringify(Array.from(deletedCampaignIds))
  );
}

function hasOutdatedSeedImage(campaign: Campaign | undefined): boolean {
  return Boolean(
    campaign?.id === "fifth-grade-gift" &&
      campaign.heroImage.includes("photo-1577896851231-70ef18881754")
  );
}
