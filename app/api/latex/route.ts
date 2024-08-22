import { NextResponse } from "next/server";
import { ratelimit } from "../limits";
import { latexToHTML } from "@/lib/utils.server";

export const POST = ratelimit(2000, async (req: Request) => {
  let body;
  try {
    body = await req.json();
  } catch (e){
    return NextResponse.json({
      error: "Invalid JSON"
    }, {status: 400});
  }
  if (typeof body.content !== "string"){
    return NextResponse.json({
      error: "Invalid JSON"
    }, {status: 400});
  }
  try {
    const html = await latexToHTML(body.content);
    return NextResponse.json({ html });
  } catch (e: any){
    return NextResponse.json({ error: e.message });
  }
});