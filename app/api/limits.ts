import { findUserBySessionId } from "../../lib/utils.server";
import { NextResponse } from "next/server";

export class RateLimiter {
  private per: number;
  private last: Record<string, Date>

  constructor(per: number) {
    this.per = per;
    this.last = {};
  }

  public hit(key: string): boolean {
    if (!this.last[key]) {
      this.last[key] = new Date();
      return true;
    }

    const diff = new Date().getTime() - this.last[key].getTime();
    if (diff > this.per) {
      this.last[key] = new Date();
      return true;
    }

    return false;
  }
}

export function ratelimit(per: number, func: Function) {
  const limiter = new RateLimiter(per);
  return async function (...args: any[]) {
    const user = findUserBySessionId();
    if (!user)
      return NextResponse.json({ error: "You are not logged in" }, { status: 401 });
    if (!limiter.hit(user.id))
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    return await func(...args);
  }
}