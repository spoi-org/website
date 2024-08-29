"use client";
import { useState, useEffect, useLayoutEffect } from 'react'

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const IS_SERVER = typeof window === "undefined";

export function useDesktop(): boolean {
  const query = "(min-width: 768px)";
  const getMatches = (): boolean => {
    if (IS_SERVER)
      return true;
    return window.matchMedia(query).matches;
  }

  const [matches, setMatches] = useState<boolean>(getMatches);
  const handleChange = () => setMatches(getMatches());

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();
    matchMedia.addEventListener("change", handleChange);
    return () => {
      matchMedia.removeEventListener("change", handleChange);
    }
  }, []);

  return matches;
}