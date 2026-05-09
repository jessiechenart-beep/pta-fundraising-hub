import { CampaignDetailClient } from "@/components/CampaignDetailClient";
import { getCampaigns } from "@/lib/campaigns";

export function generateStaticParams() {
  return getCampaigns().map((campaign) => ({ slug: campaign.slug }));
}

export default function CampaignDetailPage({ params }: { params: { slug: string } }) {
  return <CampaignDetailClient initialCampaigns={getCampaigns()} slug={params.slug} />;
}
