"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const formatted: Record<string, string> = {
  codeforces: "Codeforces",
  codechef: "CodeChef",
  usaco: "USACO",
  atcoder: "AtCoder",
  spoj: "SPOJ",
  leetcode: "LeetCode",
  hackerrank: "HackerRank",
  hackerearth: "HackerEarth",
  topcoder: "TopCoder",
  kickstart: "Kick Start",
  codejam: "Code Jam",
  cses: "CSES",
  oj: "oj.uz",
  codebreaker: "Codebreaker"
};

export function getSource(url: string): string | null {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)\./);
  return match ? (formatted[match[1]] || match[1]) : null;
}

export function withToast(toast: any, action: (...args: any[]) => any, title: string) {
  return async (...args: any[]) => {
    try {
      await action(...args);
    } catch (e) {
      console.error(e);
      toast({ title: (e as Error).message, variant: "destructive" });
      return;
    }
    const { dismiss } = toast({ title });
    setTimeout(dismiss, 3000);
  }
}

export async function request(url: string, options?: RequestInit) {
  const resp = await fetch(url, options);
  const data = await resp.json();
  if (!resp.ok)
    throw new Error(data.error);
  return data;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}