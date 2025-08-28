import { useEffect, useRef } from "react";

/**
 * useRecurringReminder
 * Starts a recurring interval when enabled that calls onTick at the given interval.
 * Cleans up automatically when disabled or unmounted.
 */
export function useRecurringReminder(
  enabled: boolean,
  intervalMs: number,
  onTick: () => void
) {
  const savedCallback = useRef(onTick);
  useEffect(() => {
    savedCallback.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);
}
