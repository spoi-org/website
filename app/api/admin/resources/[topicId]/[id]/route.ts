import { cache } from "@/lib/utils.server";
import { NextResponse } from "next/server";
import { getBody } from "../../utils";
import { checkAdmin } from "../../../utils";

export async function PATCH(req : Request, { params } : { params: { topicId: string, id: string } }) {
  const admin = checkAdmin();
  if (admin) return admin;
  const body = await getBody(req);
  if (body instanceof NextResponse) return body;
  try {
    await cache.resourceItem.update(params.topicId, params.id, {
      data: {
        id: body.id,
        title: body.title,
        order: body.order,
        description: body.description,
        content: body.content,
        topicId: body.topicId,
        public: body.public
      }
    });
  } catch (e){
    console.error(e);
    return NextResponse.json({
      error: "Resource not found"
    }, { status: 404 });
  }
  if (body.id !== params.id || body.topicId !== params.topicId) {
    cache.author.insert(body.topicId, body.id, cache.author.get(params.topicId, params.id));
    cache.author.delete(params.topicId, params.id);
  }
  if (body.authors)
    await cache.author.update(body.topicId, body.id, body.authors);
  return NextResponse.json({
    success: true
  });
}

export async function DELETE(req: Request, { params } : { params: { topicId: string, id: string } }) {
  const admin = checkAdmin();
  if (admin) return admin;
  try {
    await cache.resourceItem.delete(params.topicId, params.id);
  } catch (e){
    return NextResponse.json({
      error: "Resource not found"
    }, { status: 404 });
  }
  cache.author.delete(params.topicId, params.id);
  return NextResponse.json({
    success: true
  });
}