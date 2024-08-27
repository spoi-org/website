import { cache, findUserBySessionId } from "@/lib/utils.server";
import { NextResponse } from "next/server";

function getUser(){
  const user = findUserBySessionId();
  if (!user){
    return NextResponse.json({
      error: "You are not logged in"
    }, {status: 401});
  }
  return user;
}

export async function POST(req: Request, { params } : { params: { id: string } }){
  const user = getUser();
  if (user instanceof NextResponse) return user;
  try {
    await cache.solves.add(user.id, params.id);
  } catch (e){
    return NextResponse.json({
      error: "Unsolved problem not found"
    }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params } : { params: { id: string } }){
  const user = getUser();
  if (user instanceof NextResponse) return user;
  try {
    await cache.solves.remove(user.id, params.id);
  } catch (e){
    return NextResponse.json({
      error: "Solved problem not found"
    }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}