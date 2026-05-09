import type { CampaignStatus } from "@/types/campaign";

const statusStyles: Record<CampaignStatus, string> = {
  draft: "bg-zinc-200 text-zinc-700",
  active: "bg-mint text-meadow ring-1 ring-meadow/15",
  ended: "bg-ink text-white"
};

export function StatusPill({ status }: { status: CampaignStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
