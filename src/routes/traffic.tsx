import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Gauge,
  Infinity as InfinityIcon,
  Pause,
  Play,
  Radar,
  Rocket,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { QUOTA, dailyCap, useBoost } from "@/lib/boost";

export const Route = createFileRoute("/traffic")({
  head: () => ({
    meta: [
      { title: "Free Traffic System — Steady & Launch Modes | Snip" },
      {
        name: "description",
        content:
          "Snip is free. Route our network traffic into your short links in Steady or Launch mode with a 500,000 click weekly quota and full click intelligence.",
      },
      { property: "og:title", content: "Free Traffic System — Steady & Launch Modes | Snip" },
      {
        property: "og:description",
        content: "Two free routing modes, 500,000 clicks weekly quota, zero payment ever.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrafficPage,
});

const modes = [
  {
    id: "5" as const,
    rate: "Steady",
    title: "Everyday routing",
    icon: Radar,
    desc: "Our network traffic drips into your links slowly — a natural, human-shaped curve.",
    perks: ["~25,000 clicks / day", "Natural drip pacing", "Bot filtered sources", "Geo mix: 180+"],
  },
  {
    id: "10" as const,
    rate: "Launch",
    title: "Launch day routing",
    icon: Rocket,
    desc: "Launch pacing — double the flow while staying inside the same weekly quota.",
    perks: ["~50,000 clicks / day", "Burst pacing", "Referrer variety", "Priority edge lanes"],
  },
];

const nf = (n: number) => n.toLocaleString();

function TrafficPage() {
  const { rate, setRate, active, setActive } = useBoost();
  const [links, setLinks] = useState(4);
  const [days, setDays] = useState(5);

  const perDay = dailyCap(rate);
  const projected = Math.min(QUOTA, perDay * days * (active ? 1 : 0.35));
  const perLink = Math.round(projected / Math.max(1, links));
  const usedPct = Math.round((projected / QUOTA) * 100);

  return (
    <div className="relative">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-96" />
      <div className="aurora pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-60" />

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <InfinityIcon className="size-3.5" /> Free forever · no paid tier exists
        </span>
        <h1 className="mt-5 max-w-2xl text-4xl font-bold sm:text-5xl">
          Our traffic system, <span className="text-gradient">given away free</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Pick a routing mode, point it at a short link, and we send real network traffic. Every
          account shares the same weekly quota — 500,000 clicks, reset every Monday.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr_0.9fr]">
          {modes.map((m) => {
            const on = rate === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setRate(m.id);
                  toast.success(`${m.title} selected`, { description: `${m.rate} mode saved` });
                }}
                className={`surface-glass lift rounded-2xl p-6 text-left ${on ? "ring-soft border-primary/50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="icon-tile size-10">
                    <m.icon className="size-5" />
                  </span>
                  <span className="text-gradient font-display text-xl font-bold">{m.rate}</span>
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
                  {on ? "Selected" : "Select this mode"} <ArrowRight className="size-3.5" />
                </span>
              </button>
            );
          })}

          <aside className="surface-glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Gauge className="size-4 text-primary" /> Weekly quota
            </div>
            <p className="mt-5 font-display text-4xl font-bold">{nf(QUOTA)}</p>
            <p className="mt-1 text-xs text-muted-foreground">clicks per week · resets Monday</p>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Projected · {rate === "5" ? "Steady" : "Launch"}</span>
                <span>{usedPct}%</span>
              </div>
              <Progress value={usedPct} className="mt-2 h-1.5" />
              <p className="mt-2 text-xs text-muted-foreground">
                {nf(Math.round(projected))} / {nf(QUOTA)}
              </p>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Price", "৳0 · always"],
                ["Links", "Unlimited"],
                ["Daily cap", nf(perDay)],
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

        {/* Interactive planner */}
        <div className="surface-glass mt-4 grid gap-6 rounded-3xl p-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <span className="icon-tile size-7">
                <Sparkles className="size-3.5" />
              </span>
              Campaign planner
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Move the sliders to see how the free quota spreads across your links this week.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Active links</span>
                  <span className="font-mono text-primary">{links}</span>
                </div>
                <Slider
                  value={[links]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(v) => setLinks(v[0] ?? 1)}
                  className="mt-3"
                  aria-label="Active links"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Routing days this week</span>
                  <span className="font-mono text-primary">{days}</span>
                </div>
                <Slider
                  value={[days]}
                  min={1}
                  max={7}
                  step={1}
                  onValueChange={(v) => setDays(v[0] ?? 1)}
                  className="mt-3"
                  aria-label="Routing days"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setActive(!active);
                toast[active ? "message" : "success"](
                  active ? "Routing paused" : "Routing activated",
                );
              }}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-primary/50 bg-primary/12 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {active ? <Pause className="size-4" /> : <Play className="size-4" />}
              {active ? "Routing is live" : "Routing paused"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ["Projected clicks", nf(Math.round(projected))],
              ["Per link", nf(perLink)],
              ["Quota left", nf(Math.max(0, QUOTA - Math.round(projected)))],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-background/50 px-5 py-4"
              >
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
