import { formatCurrency } from "@/lib/campaigns";

const fundraiserPlan = [
  {
    name: "Registration First Step",
    amount: 65000,
    image: "/plan-registration-first-step.png"
  },
  {
    name: "Fun Run",
    amount: 45000,
    image: "/plan-fun-run.png"
  },
  {
    name: "Camp Quail + Teacher & Me",
    amount: 10000,
    image: "/plan-camp-quail.png"
  },
  {
    name: "Auction Gala",
    amount: 50000,
    image: "/plan-auction-gala.png"
  },
  {
    name: "Corporate Match",
    amount: 30000,
    image: "/plan-corporate-match.png"
  }
];

export function LearningFundPlan({ className = "" }: { className?: string }) {
  return (
    <section className={`rounded-lg border border-honey/35 bg-white/86 p-6 shadow-joyful ${className}`}>
      <div>
        <p className="w-fit rounded-full bg-mint px-3 py-1 text-sm font-bold uppercase tracking-[0.16em] text-meadow">
          2025-2026 plan
        </p>
        <h2 className="mt-2 text-3xl font-black">How the fundraising year is planned</h2>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {fundraiserPlan.map((item) => (
          <PlanCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  );
}

function PlanCard({
  amount,
  image,
  name
}: {
  amount: number;
  image: string;
  name: string;
}) {
  const isLongTitle = name === "Camp Quail + Teacher & Me";

  return (
    <article className="rounded-lg border border-sky/40 bg-transparent p-5 text-center shadow-sm">
      <p className="text-4xl font-black leading-none text-coral xl:text-3xl">{formatCurrency(amount)}</p>
      <div className="mt-5 flex h-32 items-center justify-center">
        <img alt="" className="max-h-full max-w-full object-contain drop-shadow-sm" src={image} />
      </div>
      <h3 className={`mt-5 font-black leading-tight ${isLongTitle ? "text-lg" : "text-xl"}`}>{name}</h3>
    </article>
  );
}
