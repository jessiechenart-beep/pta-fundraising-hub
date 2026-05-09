import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatCurrency, formatDate, getPublicCampaignStatus } from "@/lib/campaigns";
import type { Campaign } from "@/types/campaign";
import { CampaignImage } from "./CampaignImage";
import { ProgressBar } from "./ProgressBar";
import { StatusPill } from "./StatusPill";

export function CampaignCard({
  campaign,
  showProgress = true
}: {
  campaign: Campaign;
  showProgress?: boolean;
}) {
  const publicStatus = getPublicCampaignStatus(campaign);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-white/80 bg-white/88 shadow-soft backdrop-blur transition duration-300 ease-out hover:z-10 hover:-translate-y-2 hover:scale-[1.02] hover:border-white hover:bg-white hover:shadow-[0_26px_70px_rgba(36,48,47,0.18),0_14px_34px_rgba(33,124,102,0.12)]">
      <div className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 ring-2 ring-white/90 transition duration-300 group-hover:opacity-100" />
      <Link
        aria-label={`View ${campaign.title}`}
        className="focus-ring relative block overflow-hidden"
        href={`/campaigns/${campaign.slug}`}
      >
        <CampaignImage campaign={campaign} className="aspect-[3/4] w-full transition duration-500 ease-out group-hover:scale-[1.035] group-hover:saturate-[1.08]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coral/22 via-transparent to-sunshine/20 opacity-0 transition duration-300 group-hover:opacity-100" />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-coral">{formatDate(campaign.startDate)}</p>
            <StatusPill status={publicStatus} />
          </div>
          <h3 className="line-clamp-2 w-full text-xl font-bold leading-tight">{campaign.title}</h3>
        </div>
        {showProgress ? (
          <div className="space-y-2">
            <ProgressBar campaign={campaign} />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{formatCurrency(campaign.amountRaised)}</span>
              <span className="text-ink/62">Goal {formatCurrency(campaign.goalAmount)}</span>
            </div>
          </div>
        ) : null}
        <p className="line-clamp-3 text-sm leading-6 text-ink/72">{campaign.shortDescription}</p>
        {!showProgress ? (
          <a
            className="focus-ring mt-auto inline-flex w-full items-center justify-center gap-2 rounded-md bg-coral px-3 py-2 text-sm font-bold text-white shadow-[0_12px_26px_rgba(244,111,86,0.24)] transition hover:-translate-y-0.5 hover:bg-meadow"
            href={campaign.externalDonationUrl}
            rel="noreferrer"
            target="_blank"
          >
            Sign up
            <ExternalLink aria-hidden className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
