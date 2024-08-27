import { NextResponse } from "next/server";

export async function getBody(req: Request){
  let body;
  try {
    body = await req.json();
  } catch (e){
    return NextResponse.json({
      error: "Invalid JSON"
    }, {status: 400});
  }
  if (typeof body.name !== "string" || typeof body.id !== "string" || typeof body.categoryId !== "string"){
    return NextResponse.json({
      error: "Invalid JSON"
    }, {status: 400});
  }
  return body;
}