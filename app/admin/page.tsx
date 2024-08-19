import Users from "@/components/ui/admin/user";
import { Button } from "@/components/ui/button";
import { type User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

export default function Admin() {
    return (
        <div className="flex flex-wrap">
            <Link href="/admin/create">Go you ignorant asshat</Link>
            <Users />
        </div>
    )
}