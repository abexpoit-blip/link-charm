import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Globe,
  KeyRound,
  Layers,
  MousePointerClick,
  QrCode,
  Radar,
  Split,
  Timer,
  Webhook,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Branded Links, QR Codes & Analytics | Snip" },
      {
        name: "description",
        content:
          "Custom domains, deep link analytics, QR codes, A/B routing, password protection and a full API — every Snip feature in one place.",
      },
      { property: "og:title", content: "Features — Branded Links, QR Codes & Analytics | Snip" },
      {
        property: "og:description",
        content: "Every Snip capability: custom domains, analytics, QR codes, A/B routing and API.",
      },
    ],
  }),
  component: Features,
});

const groups = [
  {
    label: "Branding",
    items: [
      { icon: Globe, title: "Custom domains", body: "Unlimited branded domains and subdomains." },
      { icon: Layers, title: "Link folders", body: "Organise by campaign, client or channel." },
      { icon: QrCode, title: "Branded QR", body: "Logo, colour and frame control, SVG export." },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: BarChart3, title: "Click analytics", body: "Real-time charts down to the minute." },
      { icon: Radar, title: "Geo & device", body: "Country, city, OS, browser and referrer." },
      { icon: MousePointerClick, title: "Conversion goals", body: "Attribute signups to a link." },
    ],
  },
  {
    label: "Control",
    items: [
      { icon: Split, title: "A/B routing", body: "Weighted splits with automatic winners." },
      { icon: KeyRound, title: "Password & expiry", body: "Gate or retire links on schedule." },
      { icon: Timer, title: "Deep links", body: "Route to app or web based on device." },
    ],
  },
  {
    label: "Platform",
    items: [
      { icon: Zap, title: "Edge network", body: "Sub-40ms redirects worldwide." },
      { icon: Webhook, title: "Webhooks & API", body: "Create links from anything you build." },
      { icon: Layers, title: "Team workspaces", body: "Roles, audit trails and SSO." },
    ],
  },
];

function Features() {
  return (
    <div className="relative">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-[420px]" />

      <section className="relative mx-auto max-w-6xl px-5 pt-20 pb-10 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold sm:text-5xl">
          A link platform built like <span className="text-gradient">infrastructure</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Every feature below ships on every plan tier — the limits change, the capability doesn't.
        </p>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-14 px-5 pb-24">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-4">
              <h2 className="font-display text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                {group.label}
              </h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {group.items.map((item) => (
                <article key={item.title} className="surface-glass lift rounded-2xl p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <Button size="xl" variant="hero" asChild>
            <Link to="/pricing">
              Compare plans <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
