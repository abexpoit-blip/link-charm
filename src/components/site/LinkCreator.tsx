import { useState } from "react";
import { ArrowRight, Check, Copy, ExternalLink, Link2, QrCode, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CreatedLink = { slug: string; dest: string };

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

export function LinkCreator({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [links, setLinks] = useState<CreatedLink[]>([
    { slug: "launch-2026", dest: "https://acme.com/product/launch" },
  ]);
  const [copied, setCopied] = useState<string | null>(null);

  const create = () => {
    const parsed = normalize(url);
    if (!parsed) {
      toast.error("Enter a valid URL, e.g. acme.com/launch");
      return;
    }
    const clean = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (clean && links.some((l) => l.slug === clean)) {
      toast.error("That custom slug is already taken");
      return;
    }
    const next = { slug: clean || randomSlug(), dest: parsed.toString() };
    setLinks((prev) => [next, ...prev].slice(0, 4));
    setUrl("");
    setSlug("");
    toast.success("Short link created", { description: `snip.gy/${next.slug}` });
  };

  const copy = (s: string) => {
    navigator.clipboard?.writeText(`https://snip.gy/${s}`);
    setCopied(s);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied((c) => (c === s ? null : c)), 1600);
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Link2 className="size-3.5" />
        </span>
        Create a short link
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="Paste your long URL…"
          aria-label="Long URL"
          className="h-11 border-border bg-background/60"
        />
        <Button variant="hero" className="h-11 px-6" onClick={create}>
          Shorten <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background/40 px-3">
        <span className="font-mono text-xs text-muted-foreground">snip.gy/</span>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="custom-slug (optional)"
          aria-label="Custom slug"
          className="h-9 flex-1 bg-transparent font-mono text-xs outline-none placeholder:text-muted-foreground/70"
        />
        <button
          onClick={() => setSlug(randomSlug())}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <Wand2 className="size-3.5" /> Random
        </button>
      </div>

      <ul className={`mt-3 space-y-2 ${compact ? "max-h-40 overflow-y-auto" : ""}`}>
        {links.map((l) => (
          <li
            key={l.slug}
            className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5"
          >
            <QrCode className="size-4 shrink-0 text-primary/80" />
            <div className="min-w-0 flex-1">
              <code className="block truncate font-mono text-sm text-primary">snip.gy/{l.slug}</code>
              <span className="block truncate text-[11px] text-muted-foreground">{l.dest}</span>
            </div>
            <button
              onClick={() => copy(l.slug)}
              aria-label={`Copy snip.gy/${l.slug}`}
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
              aria-label="Open destination"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
