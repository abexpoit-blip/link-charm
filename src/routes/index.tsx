import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Check,
  Gauge,
  Globe,
  QrCode,
  Radar,
  Rocket,
  Shield,
  Sparkles,
  Split,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LinkCreator } from "@/components/site/LinkCreator";
import heroImage from "@/assets/hero-links.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snip — Premium URL Shortener with Click Analytics" },
      {
        name: "description",
        content:
          "Create branded short links on your own domain, generate QR codes and track every click in real time with Snip.",
      },
      { property: "og:title", content: "Snip — Premium URL Shortener with Click Analytics" },
      {
        property: "og:description",
        content: "Branded short links, QR codes and real-time analytics in one premium dashboard.",
      },
    ],
  }),
  component: Home,
});

const highlights = [
  { icon: Gauge, title: "500,000 clicks / week", body: "Shared free quota, resets every Monday." },
  { icon: Radar, title: "5% traffic routing", body: "Steady, human-paced drip into your links." },
  { icon: Rocket, title: "10% traffic routing", body: "Launch mode burst without extra cost." },
];


const features = [
  {
    icon: Globe,
    title: "Custom domains",
    body: "Bring your own domain and ship links that carry your brand, not someone else's.",
  },
  {
    icon: BarChart3,
    title: "Live analytics",
    body: "Clicks, devices, referrers and geography streaming in as they happen.",
  },
  {
    icon: QrCode,
    title: "Designer QR codes",
    body: "Generate branded, high-resolution QR codes for every link in one tap.",
  },
  {
    icon: Split,
    title: "A/B routing",
    body: "Split traffic across destinations and let the winning variant take over.",
  },
  {
    icon: Shield,
    title: "Link protection",
    body: "Passwords, expiry dates and bot filtering keep your destinations safe.",
  },
  {
    icon: Zap,
    title: "Edge redirects",
    body: "Served from 300+ edge locations so nobody waits for your link.",
  },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-aura pointer-events-none absolute inset-0" />
        <div className="aurora pointer-events-none absolute inset-0 opacity-70" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              100% free · no paid plan, ever
            </span>

            <h1 className="mt-6 text-5xl leading-[1.03] font-bold sm:text-6xl lg:text-7xl">
              Short links with <span className="text-gradient">serious</span> analytics
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Snip turns every long URL into a branded, trackable asset — then pushes our own
              network traffic into it at 5% or 10%, free, up to 500,000 clicks a week.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="xl" variant="hero" asChild>
                <Link to="/dashboard">
                  Open dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="xl" variant="glass" asChild>
                <Link to="/traffic">Traffic system</Link>
              </Button>
            </div>

            <ul className="mt-12 grid max-w-lg gap-3 sm:grid-cols-3">
              {highlights.map((h) => (
                <li key={h.title} className="surface-glass rounded-xl p-4">
                  <h.icon className="size-4 text-primary" />
                  <p className="mt-3 text-sm font-semibold">{h.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{h.body}</p>
                </li>
              ))}
            </ul>
          </div>


          <div className="relative">
            <img
              src={heroImage}
              alt="Glowing chain links dissolving into analytics data streams"
              width={1280}
              height={1024}
              className="w-full rounded-3xl border border-border object-cover opacity-90"
            />

            <div className="surface-glass glow-ring absolute -bottom-16 left-1/2 w-[92%] -translate-x-1/2 rounded-2xl p-5">
              <LinkCreator compact />
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 pt-32 pb-24">
        <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">
          Everything a link needs after the click
        </h2>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Built for marketing teams that treat every URL as measurable infrastructure.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="surface-glass lift rounded-2xl p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-28">
        <div className="surface-glass relative overflow-hidden rounded-3xl px-8 py-14 text-center">
          <div className="aurora pointer-events-none absolute inset-0 opacity-80" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">Start snipping in under a minute</h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Unlimited links, 5% or 10% traffic routing, 500,000 clicks weekly — all free.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="xl" variant="hero" asChild>
                <Link to="/traffic">
                  See the traffic system <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              {["No credit card", "No paid tier", "Weekly quota resets"].map((i) => (
                <li key={i} className="inline-flex items-center gap-2">
                  <Check className="size-4 text-primary" /> {i}
                </li>
              ))}
            </ul>

          </div>
        </div>
      </section>
    </div>
  );
}
