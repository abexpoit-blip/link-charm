import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  ArrowDownUp,
  ArrowUpRight,
  Copy,
  Download,
  Gauge,
  Globe,
  MousePointerClick,
  Pause,
  Play,
  QrCode,
  Radar,
  Rocket,
  Search,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { LinkCreator } from "@/components/site/LinkCreator";
import { QUOTA, dailyCap, useBoost } from "@/lib/boost";

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

type Range = "24h" | "7d" | "30d";

const RANGES: { id: Range; label: string; points: number; scale: number }[] = [
  { id: "24h", label: "24h", points: 12, scale: 0.16 },
  { id: "7d", label: "7d", points: 7, scale: 1 },
  { id: "30d", label: "30d", points: 15, scale: 4.1 },
];

const DAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildSeries(range: Range, factor: number) {
  const cfg = RANGES.find((r) => r.id === range)!;
  return Array.from({ length: cfg.points }, (_, i) => {
    const wave = 1 + Math.sin(i / 1.7) * 0.28 + ((i * 37) % 11) / 60;
    const clicks = Math.round(52_000 * cfg.scale * wave * factor);
    const label =
      range === "24h" ? `${i * 2}:00` : range === "7d" ? DAY[i] : `${i * 2 + 1}`;
    return { d: label, clicks, unique: Math.round(clicks * 0.66) };
  });
}

const hours = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}`,
  v: Math.round(900 + Math.sin(i / 2.4) * 620 + (i % 5) * 130),
}));

const baseLinks = [
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

const nf = (n: number) => n.toLocaleString();

type SortKey = "clicks" | "users" | "ctr";

function Dashboard() {
  const { rate, setRate, active, setActive } = useBoost();
  const [range, setRange] = useState<Range>("7d");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("clicks");

  const factor = (rate === "10" ? 1 : 0.52) * (active ? 1 : 0.35);
  const series = useMemo(() => buildSeries(range, factor), [range, factor]);

  const clicks = series.reduce((n, p) => n + p.clicks, 0);
  const uniques = series.reduce((n, p) => n + p.unique, 0);
  const used = Math.min(QUOTA, Math.round(QUOTA * (rate === "10" ? 0.809 : 0.425) * (active ? 1 : 0.4)));
  const pct = Math.round((used / QUOTA) * 100);

  const kpis: { icon: LucideIcon; label: string; value: string; delta: string }[] = [
    { icon: MousePointerClick, label: "Clicks", value: nf(clicks), delta: "+18.4%" },
    { icon: Users, label: "Unique users", value: nf(uniques), delta: "+12.1%" },
    { icon: Globe, label: "Countries", value: "184", delta: "+6" },
    { icon: QrCode, label: "QR scans", value: nf(Math.round(clicks * 0.047)), delta: "+24.7%" },
  ];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseLinks
      .map((l) => ({
        ...l,
        clicks: Math.round(l.clicks * factor),
        users: Math.round(l.users * factor),
      }))
      .filter((l) => !q || l.slug.includes(q) || l.dest.includes(q))
      .sort((a, b) => b[sort] - a[sort]);
  }, [query, sort, factor]);

  const exportCsv = () => {
    const csv = [
      "short_link,destination,clicks,users,share",
      ...rows.map((l) => `${l.slug},${l.dest},${l.clicks},${l.users},${l.ctr}%`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `snip-links-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported", { description: `${rows.length} links` });
  };

  return (
    <div className="relative">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-72" />
      <div className="aurora pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 py-8">
        {/* Console toolbar */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-xl font-bold sheen-text">Traffic console</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-xl border border-border bg-background/50 p-1">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    range === r.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setActive(!active);
                toast[active ? "message" : "success"](active ? "Routing paused" : "Routing resumed");
              }}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? "border-primary/45 bg-primary/12 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {active ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {active ? "Routing live" : "Paused"}
            </button>
          </div>
        </div>

        {/* Quota dial + ticker + routing switch */}
        <section className="surface-glass ring-soft overflow-hidden rounded-3xl">
          <div className="grid gap-px bg-border/60 md:grid-cols-[auto_1fr_auto]">
            <div className="flex items-center gap-5 bg-background/40 p-6">
              <div
                className="relative grid size-24 place-items-center rounded-full transition-all duration-500"
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
                <p className="mt-1 font-display text-2xl font-bold">{nf(used)}</p>
                <p className="text-xs text-muted-foreground">of {nf(QUOTA)} · free</p>
              </div>
            </div>

            <div className="bg-background/40 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Live clicks · last 24h</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                  <span
                    className={`size-1.5 rounded-full bg-primary ${active ? "animate-pulse" : "opacity-40"}`}
                  />
                  {active ? "streaming" : "paused"}
                </span>
              </div>
              <div className="mt-3 h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hours}>
                    <Bar
                      dataKey="v"
                      fill={active ? "var(--color-chart-1)" : "var(--color-muted-foreground)"}
                      radius={2}
                    />
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

            <div className="bg-background/40 p-6">
              <p className="text-xs text-muted-foreground">Our traffic routing</p>
              <div className="mt-3 flex gap-2">
                {(["5", "10"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRate(r);
                      toast.success(`Routing set to ${r}%`, {
                        description: `Daily cap ${nf(dailyCap(r))} clicks`,
                      });
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
                {rate === "5" ? "Steady drip · human-paced" : "Launch burst · 2x pace"} · cap{" "}
                {nf(dailyCap(rate))}/day
              </p>
            </div>
          </div>
        </section>

        {/* KPI strip */}
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

        <div className="mt-3 grid items-start gap-3 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-3">
            <div className="surface-glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Clicks vs unique users</h2>
                <p className="text-xs text-muted-foreground">
                  {range} · {rate}% routing
                </p>
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

            {/* Link table with search, sort, export */}
            <div className="surface-glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold">Links · clicks & users</h2>
                <div className="ml-auto flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Filter links…"
                      aria-label="Filter links"
                      className="h-8 w-40 border-border bg-background/60 pl-8 text-xs"
                    />
                  </div>
                  <button
                    onClick={() =>
                      setSort((s) => (s === "clicks" ? "users" : s === "users" ? "ctr" : "clicks"))
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowDownUp className="size-3" /> {sort}
                  </button>
                  <button
                    onClick={exportCsv}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Download className="size-3" /> CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
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
                    {rows.map((l) => (
                      <tr key={l.slug} className="transition-colors hover:bg-primary/5">
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
                          {nf(l.clicks)}
                        </td>
                        <td className="py-2.5 text-right text-xs text-muted-foreground">
                          {nf(l.users)}
                        </td>
                        <td className="w-32 py-2.5 pl-6">
                          <Progress value={l.ctr} className="h-1" />
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                          No links match “{query}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

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
