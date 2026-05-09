import { ExternalLink } from "lucide-react";

export function DonationButton({ url, label = "Give through school portal" }: { url: string; label?: string }) {
  return (
    <a
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(244,111,86,0.28)] transition hover:-translate-y-0.5 hover:bg-meadow hover:shadow-[0_18px_38px_rgba(33,124,102,0.25)]"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      {label}
      <ExternalLink aria-hidden className="h-4 w-4" />
    </a>
  );
}
