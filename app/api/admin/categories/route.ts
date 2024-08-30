import { NextResponse } from "next/server";
import { getBody } from "./utils";
import { cache } from "../../../../lib/utils.server";
import { checkAdmin } from "../utils";

export async function POST(req : Request) {
  const admin = checkAdmin();
  if (admin) return admin;
  const body = await getBody(req);
  if (body instanceof NextResponse) return body;
  try {
    await cache.category.insert({
      data: {
        name: body.name,
        id: body.id
      }
    });
  } catch (e){
    return NextResponse.json({
      error: "Category already exists"
    }, {status: 400});
  }
  return NextResponse.json({
    success: true
  });
}