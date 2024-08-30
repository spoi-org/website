import { cache } from "@/lib/utils.server";
import { ratelimit } from "../../limits";
import { checkAdmin } from "../utils";
import { NextResponse } from "next/server";

export const POST = ratelimit(300000, async () => {
  const admin = checkAdmin();
  if (admin) return admin;
  await Promise.all(Object.values(cache).map(instance => instance.init()));
  return NextResponse.json({ success: true });
});