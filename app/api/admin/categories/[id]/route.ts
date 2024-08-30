import { cache } from "../../../../../lib/utils.server";
import { NextResponse } from "next/server";
import { getBody } from "../utils";
import { checkAdmin } from "../../utils";

export async function PATCH(req : Request, { params } : { params: { id: string } }) {
  const admin = checkAdmin();
  if (admin) return admin;
  const body = await getBody(req);
  if (body instanceof NextResponse) return body;
  try {
    await cache.category.update(params.id, {
      data: {
        id: body.id,
        name: body.name
      }
    });
  } catch (e){
    return NextResponse.json({
      error: "Category not found"
    }, { status: 404 });
  }
  return NextResponse.json({
    success: true
  });
}

export async function DELETE(req: Request, { params } : { params: { id: string } }) {
  const admin = checkAdmin();
  if (admin) return admin;
  try {
    await cache.category.delete(params.id);
  } catch (e){
    return NextResponse.json({
      error: "Category not found"
    }, { status: 404 });
  }
  return NextResponse.json({
    success: true
  });
}