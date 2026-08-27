import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Copy, Globe, MousePointerClick, QrCode, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Link Dashboard — Clicks, Geography & QR | Snip" },
      {
        name: "description",
        content:
          "Track short link performance in real time: click trends, top links, geography breakdown and QR downloads.",
      },
      { property: "og:title", content: "Link Dashboard — Clicks, Geography & QR | Snip" },
      {
        property: "og:description",
        content: "Real-time click trends, top-performing links and geography insight.",
      },
    ],
  }),
  component: Dashboard,
});

const series = [
  { d: "Mon", clicks: 1820, unique: 1240 },
  { d: "Tue", clicks: 2410, unique: 1610 },
  { d: "Wed", clicks: 2190, unique: 1490 },
  { d: "Thu", clicks: 3280, unique: 2180 },
  { d: "Fri", clicks: 4120, unique: 2740 },
  { d: "Sat", clicks: 3560, unique: 2310 },
  { d: "Sun", clicks: 4890, unique: 3120 },
];

const kpis = [
  { icon: MousePointerClick, label: "Total clicks", value: "22,270", delta: "+18.4%" },
  { icon: Users, label: "Unique visitors", value: "14,690", delta: "+12.1%" },
  { icon: Globe, label: "Countries", value: "94", delta: "+6" },
  { icon: QrCode, label: "QR scans", value: "3,412", delta: "+24.7%" },
];

const links = [
  { slug: "snip.gy/launch-2026", dest: "acme.com/product/launch", clicks: 8412, ctr: 78 },
  { slug: "snip.gy/spring-sale", dest: "acme.com/sale/spring", clicks: 5230, ctr: 61 },
  { slug: "snip.gy/dev-docs", dest: "docs.acme.com/getting-started", clicks: 3980, ctr: 44 },
  { slug: "snip.gy/podcast-ep12", dest: "acme.com/podcast/12", clicks: 2611, ctr: 33 },
];

const geo = [
  { country: "United States", pct: 38 },
  { country: "Bangladesh", pct: 21 },
  { country: "Germany", pct: 16 },
  { country: "Brazil", pct: 14 },
  { country: "Japan", pct: 11 },
];

function Dashboard() {
  return (
    <div className="relative">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-80" />

      <div className="relative mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Workspace overview</h1>
            <p className="mt-2 text-sm text-muted-foreground">Last 7 days · acme.snip.gy</p>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <Input placeholder="Paste a URL to shorten…" className="h-10 bg-background/60" />
            <Button variant="hero" className="h-10 px-5" onClick={() => toast.success("Link created")}>
              Create
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="surface-glass lift rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <k.icon className="size-4" />
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-primary">
                  <ArrowUpRight className="size-3" />
                  {k.delta}
                </span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold">{k.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="surface-glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Click trend</h2>
            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ left: -20, right: 8 }}>
                  <defs>
                    <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="uniqueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="d"
                    tickLine={false}
                    axisLine={false}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    fill="url(#clicksFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="unique"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    fill="url(#uniqueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="surface-glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Top geographies</h2>
            <ul className="mt-6 space-y-5">
              {geo.map((g) => (
                <li key={g.country}>
                  <div className="flex justify-between text-sm">
                    <span>{g.country}</span>
                    <span className="text-muted-foreground">{g.pct}%</span>
                  </div>
                  <Progress value={g.pct * 2.4} className="mt-2 h-1.5" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="surface-glass mt-4 rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Top links</h2>
          <div className="mt-5 divide-y divide-border">
            {links.map((l) => (
              <div
                key={l.slug}
                className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm text-primary">{l.slug}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`https://${l.slug}`);
                        toast.success("Copied");
                      }}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`Copy ${l.slug}`}
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{l.dest}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-28">
                    <Progress value={l.ctr} className="h-1.5" />
                  </div>
                  <span className="font-display text-sm font-semibold">
                    {l.clicks.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
