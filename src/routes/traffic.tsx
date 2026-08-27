import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Gauge, Infinity as InfinityIcon, Radar, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/traffic")({
  head: () => ({
    meta: [
      { title: "Free Traffic System — 5% & 10% Boost | Snip" },
      {
        name: "description",
        content:
          "Snip is 100% free. Route our traffic to your short links at 5% or 10% boost with a 500,000 click weekly quota and full click intelligence.",
      },
      { property: "og:title", content: "Free Traffic System — 5% & 10% Boost | Snip" },
      {
        property: "og:description",
        content: "Two free boost modes, 500,000 clicks weekly quota, zero payment ever.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrafficPage,
});

const modes = [
  {
    id: "5",
    rate: "5%",
    title: "Steady boost",
    icon: Radar,
    desc: "5% of our network traffic is routed into your links — slow, natural, human-shaped curve.",
    perks: ["~25,000 clicks / day", "Natural drip pacing", "Bot filtered sources", "Geo mix: 180+"],
  },
  {
    id: "10",
    rate: "10%",
    title: "Launch boost",
    icon: Rocket,
    desc: "10% routing for launches — double the flow while staying inside the same weekly quota.",
    perks: ["~50,000 clicks / day", "Burst pacing", "Referrer variety", "Priority edge lanes"],
  },
];

function TrafficPage() {
  const [active, setActive] = useState("10");
  const used = active === "10" ? 348000 : 172000;
  const quota = 500000;

  return (
    <div className="relative">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-96" />

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <InfinityIcon className="size-3.5" /> Free forever · no paid tier exists
        </span>
        <h1 className="mt-5 max-w-2xl text-4xl font-bold sm:text-5xl">
          Our traffic system, <span className="text-gradient">given away free</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Pick a routing rate, point it at a short link, and we send real network traffic. Every
          account shares the same weekly quota — 500,000 clicks, reset every Monday.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr_0.9fr]">
          {modes.map((m) => {
            const on = active === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`surface-glass lift rounded-2xl p-6 text-left ${on ? "glow-ring border-primary/50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <m.icon className="size-5" />
                  </span>
                  <span className="font-display text-3xl font-bold text-gradient">{m.rate}</span>
                </div>
                <h2 className="mt-5 text-lg font-semibold">{m.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {m.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="size-4 shrink-0 text-primary" /> {p}
                    </li>
                  ))}
                </ul>
                <span
                  className={`mt-6 inline-flex items-center gap-2 text-xs font-medium ${on ? "text-primary" : "text-muted-foreground"}`}
                >
                  {on ? "Selected" : "Select this rate"} <ArrowRight className="size-3.5" />
                </span>
              </button>
            );
          })}

          <aside className="surface-glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Gauge className="size-4 text-primary" /> Weekly quota
            </div>
            <p className="mt-5 font-display text-4xl font-bold">500,000</p>
            <p className="mt-1 text-xs text-muted-foreground">clicks per week · resets Monday</p>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Used at {active}%</span>
                <span>{Math.round((used / quota) * 100)}%</span>
              </div>
              <Progress value={(used / quota) * 100} className="mt-2 h-1.5" />
              <p className="mt-2 text-xs text-muted-foreground">
                {used.toLocaleString()} / {quota.toLocaleString()}
              </p>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Price", "৳0 · always"],
                ["Links", "Unlimited"],
                ["Daily cap", active === "10" ? "50,000" : "25,000"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-t border-border pt-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <Button variant="hero" className="mt-6 w-full" asChild>
              <Link to="/dashboard">
                Start routing <ArrowRight className="size-4" />
              </Link>
            </Button>
          </aside>
        </div>
      </section>
    </div>
  );
}
