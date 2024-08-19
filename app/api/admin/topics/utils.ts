import { findUserBySessionId } from "@/lib/utils.server";
import { NextResponse } from "next/server";

export async function checkAdmin(){
    const user = await findUserBySessionId();
    if (!user){
        return NextResponse.json({
            error: "You are not logged in"
        }, {status: 401});
    }
    if (!user.admin){
        return NextResponse.json({
            error: "You are not an admin"
        }, {status: 403});
    }
    return null;
}

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