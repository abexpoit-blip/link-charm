import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Free, Pro and Scale Plans | Snip" },
      {
        name: "description",
        content:
          "Start free with 1,000 branded links. Upgrade to Pro or Scale for custom domains, deeper analytics and team seats.",
      },
      { property: "og:title", content: "Pricing — Free, Pro and Scale Plans | Snip" },
      {
        property: "og:description",
        content: "Transparent link shortener pricing — free forever tier, then Pro and Scale.",
      },
    ],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "Starter",
    monthly: 0,
    tag: "Free forever",
    blurb: "For personal projects and first campaigns.",
    features: ["1,000 branded links", "1 custom domain", "30-day analytics", "Basic QR codes"],
  },
  {
    name: "Pro",
    monthly: 24,
    tag: "Most popular",
    blurb: "For marketers running always-on campaigns.",
    features: [
      "50,000 branded links",
      "10 custom domains",
      "2-year analytics history",
      "A/B routing & deep links",
      "Branded QR studio",
      "API + webhooks",
    ],
    featured: true,
  },
  {
    name: "Scale",
    monthly: 89,
    tag: "Teams",
    blurb: "For teams that need governance and volume.",
    features: [
      "Unlimited links",
      "Unlimited domains",
      "SSO & audit log",
      "Role-based workspaces",
      "Conversion attribution",
      "Priority support SLA",
    ],
  },
];

function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="relative">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-[420px]" />

      <section className="relative mx-auto max-w-6xl px-5 pt-20 pb-12 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Pricing that scales with <span className="text-gradient">clicks</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
          No per-click fees, no surprise overage. Switch tiers whenever traffic shifts.
        </p>

        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <span className={cn(!yearly && "text-foreground", yearly && "text-muted-foreground")}>
            Monthly
          </span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className={cn(yearly ? "text-foreground" : "text-muted-foreground")}>
            Yearly
            <span className="ml-2 rounded-full bg-primary/12 px-2 py-0.5 text-xs text-primary">
              −20%
            </span>
          </span>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-5 px-5 pb-24 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = yearly ? Math.round(plan.monthly * 0.8) : plan.monthly;
          return (
            <article
              key={plan.name}
              className={cn(
                "surface-glass relative rounded-3xl p-8",
                plan.featured && "glow-ring border-primary/40",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="size-3" /> {plan.tag}
                </span>
              )}
              <h2 className="font-display text-xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{plan.blurb}</p>

              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-5xl font-bold">${price}</span>
                <span className="pb-2 text-sm text-muted-foreground">/mo</span>
              </div>

              <Button
                variant={plan.featured ? "hero" : "glass"}
                size="lg"
                className="mt-6 w-full"
              >
                {plan.monthly === 0 ? "Start free" : `Choose ${plan.name}`}
              </Button>

              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </div>
  );
}
