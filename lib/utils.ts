import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export let auths : Record<string, {avatar: string, name: string, id: string}> = {}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
