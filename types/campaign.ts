export type CampaignType =
  | "Direct Donation"
  | "Gala / Event"
  | "Restaurant Fundraiser"
  | "Class Contribution"
  | "Class event"
  | "School event";

export type CampaignStatus = "draft" | "active" | "ended";

export type CampaignCategory = "campaign" | "event";

export type PayoutStatus = "pending" | "requested" | "paid";

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  type: CampaignType;
  shortDescription: string;
  fullDescription: string;
  supports: string;
  goalAmount: number;
  amountRaised: number;
  startDate: string;
  deadline: string;
  heroImage: string;
  heroImageFit?: "cover" | "contain";
  heroImagePosition?: string;
  externalDonationUrl: string;
  externalActionLabel?: string;
  status: CampaignStatus;
  category?: CampaignCategory;
  displayOrder?: number;
  managerUserId?: string;
  featured?: boolean;
  pastImpact: string[];
  restaurant?: {
    restaurantName: string;
    location: string;
    instructions: string;
    donationPercentage: number;
    promoCode?: string;
    participationCount: number;
    expectedDonation: number;
    actualReceivedAmount: number;
    payoutStatus: PayoutStatus;
    parentSelfReportNote?: string;
  };
};
