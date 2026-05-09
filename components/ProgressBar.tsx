import { getProgressPercent } from "@/lib/campaigns";
import type { Campaign } from "@/types/campaign";

export function ProgressBar({ campaign }: { campaign: Pick<Campaign, "amountRaised" | "goalAmount"> }) {
  const progress = getProgressPercent(campaign);

  return (
    <div aria-label={`${progress}% funded`} className="h-3 w-full rounded-full bg-zinc-200">
      <div
        className="h-full rounded-full bg-coral shadow-[0_0_18px_rgba(244,111,86,0.35)] transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
