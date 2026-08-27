import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowRight,
  BarChart3,
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  QrCode,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type CreatedLink = { slug: string; dest: string; createdAt: number; clicks: number };

const STORAGE_KEY = "snip.links.v1";
const DOMAIN = "snip.gy";

function normalize(raw: string) {
  const v = raw.trim();
  if (!v) return null;
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (!u.hostname.includes(".")) return null;
    return u;
  } catch {
    return null;
  }
}

const randomSlug = () => Math.random().toString(36).slice(2, 8);

const seed: CreatedLink[] = [
  { slug: "launch-2026", dest: "https://acme.com/product/launch", createdAt: Date.now(), clicks: 1284 },
];

function load(): CreatedLink[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as CreatedLink[];
    return Array.isArray(parsed) && parsed.length ? parsed : seed;
  } catch {
    return seed;
  }
}

export function LinkCreator({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [links, setLinks] = useState<CreatedLink[]>(seed);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrFor, setQrFor] = useState<CreatedLink | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => setLinks(load()), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    if (!qrFor) {
      setQrData(null);
      return;
    }
    QRCode.toDataURL(`https://${DOMAIN}/${qrFor.slug}`, {
      width: 512,
      margin: 1,
      color: { dark: "#0b1a14", light: "#ffffff" },
    })
      .then(setQrData)
      .catch(() => toast.error("Could not render QR code"));
  }, [qrFor]);

  const totalClicks = useMemo(() => links.reduce((n, l) => n + l.clicks, 0), [links]);

  const slugPreview = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const urlValid = normalize(url) !== null;

  const create = () => {
    const parsed = normalize(url);
    if (!parsed) {
      toast.error("Enter a valid URL, e.g. acme.com/launch");
      return;
    }
    if (slugPreview && links.some((l) => l.slug === slugPreview)) {
      toast.error("That custom slug is already taken");
      return;
    }
    const next: CreatedLink = {
      slug: slugPreview || randomSlug(),
      dest: parsed.toString(),
      createdAt: Date.now(),
      clicks: 0,
    };
    setLinks((prev) => [next, ...prev].slice(0, 8));
    setUrl("");
    setSlug("");
    toast.success("Short link created", { description: `${DOMAIN}/${next.slug}` });
  };

  const copy = (s: string) => {
    navigator.clipboard?.writeText(`https://${DOMAIN}/${s}`);
    setCopied(s);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied((c) => (c === s ? null : c)), 1600);
  };

  const remove = (s: string) => {
    setLinks((prev) => prev.filter((l) => l.slug !== s));
    toast("Link removed", { description: `${DOMAIN}/${s}` });
  };

  const visit = (l: CreatedLink) => {
    setLinks((prev) => prev.map((x) => (x.slug === l.slug ? { ...x, clicks: x.clicks + 1 } : x)));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <span className="icon-tile size-7">
            <Link2 className="size-3.5" />
          </span>
          Create a short link
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
          <BarChart3 className="size-3 text-primary" />
          {totalClicks.toLocaleString()} clicks
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="Paste your long URL…"
          aria-label="Long URL"
          className={`h-11 bg-background/60 transition-colors ${
            url && !urlValid ? "border-destructive/60" : "border-border"
          }`}
        />
        <Button variant="hero" className="h-11 px-6" onClick={create}>
          Shorten <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background/40 px-3">
        <span className="shrink-0 font-mono text-xs text-muted-foreground">{DOMAIN}/</span>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="custom-slug (optional)"
          aria-label="Custom slug"
          className="h-9 w-full min-w-0 flex-1 bg-transparent font-mono text-xs outline-none placeholder:text-muted-foreground/70"
        />
        <button
          onClick={() => setSlug(randomSlug())}
          className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <Wand2 className="size-3.5" /> <span className="hidden xs:inline sm:inline">Random</span>
        </button>
      </div>

      <ul className={`mt-3 space-y-2 ${compact ? "max-h-44 overflow-y-auto pr-1" : ""}`}>
        {links.map((l) => (
          <li
            key={l.slug}
            className="group flex items-center gap-2.5 rounded-xl sm:gap-3 border border-border bg-background/50 px-3 py-2.5 transition-colors hover:border-primary/35"
          >
            <button
              onClick={() => setQrFor(l)}
              aria-label={`Show QR code for ${DOMAIN}/${l.slug}`}
              className="text-primary/80 transition-colors hover:text-primary"
            >
              <QrCode className="size-4 shrink-0" />
            </button>
            <div className="min-w-0 flex-1">
              <code className="block truncate font-mono text-sm text-primary">
                {DOMAIN}/{l.slug}
              </code>
              <span className="block truncate text-[11px] text-muted-foreground">{l.dest}</span>
            </div>
            <span className="hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:block">
              {l.clicks.toLocaleString()}
            </span>
            <button
              onClick={() => copy(l.slug)}
              aria-label={`Copy ${DOMAIN}/${l.slug}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied === l.slug ? (
                <Check className="size-3.5 text-primary" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
            <a
              href={l.dest}
              target="_blank"
              rel="noreferrer"
              onClick={() => visit(l)}
              aria-label="Open destination"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
            </a>
            <button
              onClick={() => remove(l.slug)}
              aria-label={`Delete ${DOMAIN}/${l.slug}`}
              className="text-muted-foreground/70 transition-colors hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
        {links.length === 0 && (
          <li className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            No links yet — paste a URL above to create your first one.
          </li>
        )}
      </ul>

      <Dialog open={!!qrFor} onOpenChange={(o) => !o && setQrFor(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">QR code</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              https://{DOMAIN}/{qrFor?.slug}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {qrData ? (
              <img
                src={qrData}
                alt={`QR code for ${DOMAIN}/${qrFor?.slug}`}
                className="size-48 rounded-xl border border-border bg-white p-2"
              />
            ) : (
              <div className="size-48 animate-pulse rounded-xl bg-muted" />
            )}
            {qrData && (
              <Button asChild variant="glass" className="w-full">
                <a href={qrData} download={`${qrFor?.slug}-qr.png`}>
                  <Download className="size-4" /> Download PNG
                </a>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
