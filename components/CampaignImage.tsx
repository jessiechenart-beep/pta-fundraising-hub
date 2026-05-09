import type { Campaign } from "@/types/campaign";

export function CampaignImage({
  campaign,
  className = ""
}: {
  campaign: Pick<Campaign, "heroImage" | "heroImageFit" | "heroImagePosition">;
  className?: string;
}) {
  return (
    <div
      className={`bg-linen bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${campaign.heroImage})`,
        backgroundPosition: campaign.heroImagePosition ?? "50% 50%",
        backgroundSize: campaign.heroImageFit ?? "contain"
      }}
    />
  );
}
