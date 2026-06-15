"use client";

import { useEffect, useState, type DependencyList } from "react";

export interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

/** Run an async loader on mount / when deps change, with loading + error state. */
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  initial: T,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: initial,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const run = async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await loader();
        if (active) setState({ data, loading: false, error: null });
      } catch (e) {
        if (active) setState((s) => ({ ...s, loading: false, error: String(e) }));
      }
    };
    run();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
