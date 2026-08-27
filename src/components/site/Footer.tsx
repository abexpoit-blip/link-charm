import { Link } from "@tanstack/react-router";
import { Link2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Link2 className="size-3.5" />
          </span>
          <span className="font-display text-base font-bold">Snip</span>
        </Link>
        <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link to="/features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link to="/traffic" className="transition-colors hover:text-foreground">
            Traffic
          </Link>

          <Link to="/dashboard" className="transition-colors hover:text-foreground">
            Dashboard
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">© 2026 Snip. Short links, deep insight.</p>
      </div>
    </footer>
  );
}
