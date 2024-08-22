import Users from "@/components/ui/admin/user";
import Link from "next/link";

export default function Admin() {
    return (
        <div className="flex flex-wrap">
            <Link href="/admin/create">Go you ignorant asshat</Link>
            <Users />
        </div>
    )
}