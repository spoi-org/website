import { NextResponse } from "next/server";
import { getBody } from "./utils";
import { cache } from "@/lib/utils.server";
import { checkAdmin } from "../utils";

export async function POST(req : Request) {
  const admin = checkAdmin();
  if (admin) return admin;
  const body = await getBody(req);
  if (body instanceof NextResponse) return body;
  try {
    const data = await cache.resourceItem.insert({
      data: {
        title: body.title,
        order: body.order,
        id: body.id,
        topicId: body.topicId,
        description: body.description,
        content: body.content || `This is the content for resource ${body.title}`,
        public: body.public
      }
    });
    if (body.authors)
      await cache.author.update(data.topicId, data.id, body.authors);
  } catch (e){
    return NextResponse.json({
      error: "Resource already exists"
    }, {status: 400});
  }
  return NextResponse.json({
    success: true
  });
}