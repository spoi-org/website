import { findUserBySessionId } from "@/lib/utils.server";
import { NextResponse } from "next/server";

export function checkAdmin(){
    const user = findUserBySessionId();
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