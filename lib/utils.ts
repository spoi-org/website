"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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