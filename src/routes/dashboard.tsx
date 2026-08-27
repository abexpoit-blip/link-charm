import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  ArrowUpRight,
  Copy,
  Gauge,
  Globe,
  MousePointerClick,
  QrCode,
  Radar,
  Rocket,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { LinkCreator } from "@/components/site/LinkCreator";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Traffic Console — Clicks, Users & Quota | Snip" },
      {
        name: "description",
        content:
          "A dense, single-screen console: weekly quota, 5% or 10% traffic routing, live click trend, visitor sources and top links.",
      },
      { property: "og:title", content: "Traffic Console — Clicks, Users & Quota | Snip" },
      {
        property: "og:description",
        content: "Every click, user and quota number on one compact premium screen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const series = [
  { d: "Mon", clicks: 41200, unique: 28100 },
  { d: "Tue", clicks: 52400, unique: 34600 },
  { d: "Wed", clicks: 47800, unique: 31200 },
  { d: "Thu", clicks: 61900, unique: 40800 },
  { d: "Fri", clicks: 73500, unique: 48200 },
  { d: "Sat", clicks: 58200, unique: 37700 },
  { d: "Sun", clicks: 69400, unique: 45100 },
];

const hours = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}`,
  v: Math.round(900 + Math.sin(i / 2.4) * 620 + (i % 5) * 130),
}));

const kpis = [
  { icon: MousePointerClick, label: "Clicks", value: "404,400", delta: "+18.4%" },
  { icon: Users, label: "Unique users", value: "265,700", delta: "+12.1%" },
  { icon: Globe, label: "Countries", value: "184", delta: "+6" },
  { icon: QrCode, label: "QR scans", value: "18,940", delta: "+24.7%" },
];

const links = [
  { slug: "snip.gy/launch-2026", dest: "acme.com/product/launch", clicks: 148120, users: 96400, ctr: 88 },
  { slug: "snip.gy/spring-sale", dest: "acme.com/sale/spring", clicks: 92300, users: 61050, ctr: 64 },
  { slug: "snip.gy/dev-docs", dest: "docs.acme.com/start", clicks: 71980, users: 44210, ctr: 47 },
  { slug: "snip.gy/podcast-12", dest: "acme.com/podcast/12", clicks: 46110, users: 29880, ctr: 31 },
  { slug: "snip.gy/newsletter", dest: "acme.com/subscribe", clicks: 29440, users: 18700, ctr: 22 },
];

const geo = [
  { c: "United States", p: 31 },
  { c: "Bangladesh", p: 24 },
  { c: "India", p: 17 },
  { c: "Germany", p: 15 },
  { c: "Brazil", p: 13 },
];

const sources = [
  { s: "Direct", p: 42 },
  { s: "Social", p: 27 },
  { s: "Search", p: 19 },
  { s: "Referral", p: 12 },
];

const devices = [
  { d: "Mobile", p: 63 },
  { d: "Desktop", p: 29 },
  { d: "Tablet", p: 8 },
];

function Dashboard() {
  const [rate, setRate] = useState<"5" | "10">("10");
  const quota = 500000;
  const used = rate === "10" ? 404400 : 212300;
  const pct = Math.round((used / quota) * 100);

  return (
    <div className="relative">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-72" />

      <div className="relative mx-auto max-w-6xl px-5 py-8">
        {/* Unique compact hero: quota dial + routing switch + live ticker */}
        <section className="surface-glass glow-ring overflow-hidden rounded-3xl">
          <div className="grid gap-px bg-border/60 md:grid-cols-[auto_1fr_auto]">
            {/* quota dial */}
            <div className="flex items-center gap-5 bg-background/40 p-6">
              <div
                className="relative grid size-24 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(var(--color-primary) ${pct * 3.6}deg, color-mix(in oklab, var(--foreground) 10%, transparent) 0)`,
                }}
              >
                <div className="grid size-[76px] place-items-center rounded-full bg-background">
                  <span className="font-display text-xl font-bold">{pct}%</span>
                </div>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Gauge className="size-3.5 text-primary" /> Weekly quota
                </p>
                <p className="mt-1 font-display text-2xl font-bold">{used.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">of {quota.toLocaleString()} · free</p>
              </div>
            </div>

            {/* live ticker */}
            <div className="bg-background/40 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Live clicks · last 24h</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" /> streaming
                </span>
              </div>
              <div className="mt-3 h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hours}>
                    <Bar dataKey="v" fill="var(--color-chart-1)" radius={2} />
                    <XAxis dataKey="h" hide />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* routing switch */}
            <div className="bg-background/40 p-6">
              <p className="text-xs text-muted-foreground">Our traffic routing</p>
              <div className="mt-3 flex gap-2">
                {(["5", "10"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRate(r);
                      toast.success(`Routing set to ${r}%`);
                    }}
                    className={`flex flex-1 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      rate === r
                        ? "border-primary/60 bg-primary/12 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "5" ? <Radar className="size-4" /> : <Rocket className="size-4" />} {r}%
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {rate === "5" ? "Steady drip · human-paced" : "Launch burst · 2x pace"}
              </p>
            </div>
          </div>
        </section>

        {/* KPI strip — dense */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="surface-glass lift flex items-center gap-3 rounded-xl p-4">
              <span className="icon-tile size-9 shrink-0">
                <k.icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl leading-none font-bold">{k.value}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{k.label}</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-0.5 text-xs text-primary">
                <ArrowUpRight className="size-3" />
                {k.delta}
              </span>
            </div>
          ))}
        </div>


        {/* Main grid — everything in little space */}
        <div className="mt-3 grid items-start gap-3 lg:grid-cols-[1.5fr_1fr]">
          <div className="surface-glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Clicks vs unique users</h2>
              <p className="text-xs text-muted-foreground">7 days · {rate}% routing</p>
            </div>
            <div className="mt-4 h-[26rem] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ left: 0, right: 4, top: 4 }}>
                  <defs>
                    <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="d"
                    tickLine={false}
                    axisLine={false}
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    fill="url(#c1)"
                  />
                  <Area
                    type="monotone"
                    dataKey="unique"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    fill="url(#c2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* creator + mini panels stacked tight */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="surface-glass rounded-2xl p-5 sm:col-span-2 lg:col-span-1">
              <LinkCreator compact />
            </div>
            <MiniList icon={Globe} title="Geography" rows={geo.map((g) => [g.c, g.p] as const)} />
            <MiniList icon={Radar} title="Sources" rows={sources.map((s) => [s.s, s.p] as const)} />
            <MiniList
              icon={Smartphone}
              title="Devices"
              rows={devices.map((d) => [d.d, d.p] as const)}
            />
          </div>

        </div>

        {/* Dense link table */}
        <div className="surface-glass mt-3 overflow-x-auto rounded-2xl p-5">
          <h2 className="text-sm font-semibold">Links · clicks & users</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-2 font-normal">Short link</th>
                <th className="pb-2 font-normal">Destination</th>
                <th className="pb-2 text-right font-normal">Clicks</th>
                <th className="pb-2 text-right font-normal">Users</th>
                <th className="pb-2 pl-6 font-normal">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map((l) => (
                <tr key={l.slug}>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs text-primary">{l.slug}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(`https://${l.slug}`);
                          toast.success("Copied");
                        }}
                        aria-label={`Copy ${l.slug}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </td>
                  <td className="max-w-[180px] truncate py-2.5 text-xs text-muted-foreground">
                    {l.dest}
                  </td>
                  <td className="py-2.5 text-right font-display text-xs font-semibold">
                    {l.clicks.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right text-xs text-muted-foreground">
                    {l.users.toLocaleString()}
                  </td>
                  <td className="w-32 py-2.5 pl-6">
                    <Progress value={l.ctr} className="h-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MiniList({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: LucideIcon;
  rows: readonly (readonly [string, number])[];
}) {
  return (
    <div className="surface-glass rounded-2xl p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <span className="icon-tile size-7">
          <Icon className="size-3.5" />
        </span>
        {title}
      </h2>

      <ul className="mt-3 space-y-2.5">
        {rows.map(([label, p]) => (
          <li key={label}>
            <div className="flex justify-between text-xs">
              <span>{label}</span>
              <span className="text-muted-foreground">{p}%</span>
            </div>
            <Progress value={p * 2.2} className="mt-1.5 h-1" />
          </li>
        ))}
      </ul>
    </div>
  );
}
