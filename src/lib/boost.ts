import { useCallback, useEffect, useState } from "react";

export type BoostRate = "5" | "10";

const KEY = "snip.boost.v1";

export const QUOTA = 500_000;

export function dailyCap(rate: BoostRate) {
  return rate === "10" ? 50_000 : 25_000;
}

/** Shared, persisted traffic-routing rate used by the dashboard and traffic pages. */
export function useBoost() {
  const [rate, setRateState] = useState<BoostRate>("10");
  const [active, setActiveState] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      const v = JSON.parse(raw) as { rate?: BoostRate; active?: boolean };
      if (v.rate === "5" || v.rate === "10") setRateState(v.rate);
      if (typeof v.active === "boolean") setActiveState(v.active);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: { rate: BoostRate; active: boolean }) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const setRate = useCallback(
    (r: BoostRate) => {
      setRateState(r);
      persist({ rate: r, active });
    },
    [active, persist],
  );

  const setActive = useCallback(
    (a: boolean) => {
      setActiveState(a);
      persist({ rate, active: a });
    },
    [rate, persist],
  );

  return { rate, setRate, active, setActive };
}
