import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LifeBuoy,
  MessageSquare,
  Send,
  ShieldCheck,
  Search,
  Timer,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Help, Answers & Live Status | Snip" },
      {
        name: "description",
        content:
          "Get help with short links, traffic routing and your weekly quota. Free support with fast human replies, FAQs and live platform status.",
      },
      { property: "og:title", content: "Support — Help, Answers & Live Status | Snip" },
      {
        property: "og:description",
        content: "FAQs, live status and a direct line to the Snip team — free, like everything else.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Support,
});

const channels = [
  {
    icon: MessageSquare,
    title: "Live chat",
    body: "Median first reply in 4 minutes, 24/7 across every timezone.",
    action: "Start a chat",
  },
  {
    icon: BookOpen,
    title: "Docs & guides",
    body: "Setup, custom domains, routing modes and quota mechanics explained.",
    action: "Read the docs",
  },
  {
    icon: ShieldCheck,
    title: "Abuse & safety",
    body: "Report a malicious link — reviewed and killed within 15 minutes.",
    action: "Report a link",
  },
];

const stats = [
  { icon: Timer, label: "Median first reply", value: "4 min" },
  { icon: CheckCircle2, label: "Resolved in 24h", value: "97.3%" },
  { icon: Zap, label: "Edge uptime", value: "99.99%" },
];

const faqs = [
  {
    q: "Is Snip really free?",
    a: "Yes. There is no paid tier, no card and no trial. Every account gets unlimited short links plus 500,000 routed clicks per week.",
  },
  {
    q: "What is the difference between 5% and 10% routing?",
    a: "5% is a steady, human-paced drip that keeps traffic looking organic. 10% is launch mode — the same network, twice the pace, for spikes and product launches.",
  },
  {
    q: "When does the weekly quota reset?",
    a: "Every Monday at 00:00 UTC. Unused clicks do not roll over, so plan bursts near the start of the week.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. Point a CNAME at our edge and every link you create is served on your brand with the same analytics.",
  },
  {
    q: "How long is click data kept?",
    a: "Click, user, source and geography data is retained for 12 months and exportable as CSV at any time.",
  },
];

function Support() {
  const [open, setOpen] = useState<number | null>(0);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ email: "", topic: "", message: "" });

  const needle = q.trim().toLowerCase();
  const visibleFaqs = needle
    ? faqs.filter((f) => f.q.toLowerCase().includes(needle) || f.a.toLowerCase().includes(needle))
    : faqs;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes("@") || form.message.trim().length < 10) {
      toast.error("Add a valid email and a few more details");
      return;
    }
    setForm({ email: "", topic: "", message: "" });
    toast.success("Ticket opened", { description: "We usually reply within 4 minutes." });
  };

  return (
    <div className="relative">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-80" />
      <div className="aurora pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <LifeBuoy className="size-3.5" /> Free support, real humans
        </span>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold sm:text-5xl">
          Help that answers <span className="text-gradient">before</span> you need it
        </h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Links, routing, quota or domains — ask anything. Support is included for every account,
          because there is nothing to upgrade to.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="surface-glass flex items-center gap-3 rounded-xl p-4">
              <span className="icon-tile size-9">
                <s.icon className="size-4" />
              </span>
              <div>
                <p className="font-display text-lg leading-none font-bold">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {channels.map((c) => (
            <article key={c.title} className="surface-glass lift rounded-2xl p-6">
              <span className="icon-tile size-10">
                <c.icon className="size-5" />
              </span>
              <h2 className="mt-5 text-lg font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              <button
                onClick={() => toast.success(`${c.title} opening…`)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary"
              >
                {c.action} <ArrowRight className="size-3.5" />
              </button>
            </article>
          ))}
        </div>

        <div className="mt-4 grid items-start gap-3 lg:grid-cols-[1.1fr_1fr]">
          <section className="surface-glass rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">Frequent questions</h2>
              <div className="relative ml-auto">
                <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search answers…"
                  aria-label="Search answers"
                  className="h-8 w-44 bg-background/60 pl-8 text-xs"
                />
              </div>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {visibleFaqs.map((f, i) => (
                <li key={f.q}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    className="flex w-full items-center justify-between gap-4 py-3 text-left text-sm font-medium"
                  >
                    {f.q}
                    <ArrowRight
                      className={`size-4 shrink-0 text-primary transition-transform ${
                        open === i ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {open === i && (
                    <p className="pb-4 text-sm text-muted-foreground">{f.a}</p>
                  )}
                </li>
              ))}
              {visibleFaqs.length === 0 && (
                <li className="py-6 text-center text-xs text-muted-foreground">
                  Nothing matches “{q}” — open a ticket and we will answer it.
                </li>
              )}
            </ul>
          </section>

          <form onSubmit={submit} className="surface-glass ring-soft rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Open a ticket</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Replies land in your inbox and in the console.
            </p>
            <div className="mt-4 space-y-2">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                aria-label="Email"
                className="h-11 bg-background/60"
              />
              <Input
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="Topic — routing, quota, domains…"
                aria-label="Topic"
                className="h-11 bg-background/60"
              />
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what's happening…"
                aria-label="Message"
                rows={5}
                className="bg-background/60"
              />
            </div>
            <Button type="submit" variant="hero" className="mt-3 h-11 w-full">
              Send message <Send className="size-4" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Prefer self-serve? Check the{" "}
              <Link to="/traffic" className="text-primary">
                traffic system
              </Link>{" "}
              page.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
