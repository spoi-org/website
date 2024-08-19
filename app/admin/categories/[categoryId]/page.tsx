import { prisma } from "@/lib/utils.server";
import AdminTopics from "./component";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TopicsPage({ params } : { params: { categoryId: string } }){
    const topics = (await prisma.category.findUnique({
        where: {
            id: params.categoryId
        },
        include: {
            topics: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    }))?.topics;
    if (!topics){
        <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
            <h1 className="text-4xl font-extrabold">404</h1>
            <p className="text-xl">Category not found</p>
            <Link href="/">
                <Button className="text-lg">
                    Back to Home
                </Button>
            </Link>
        </div>
    }
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return <AdminTopics categoryId={params.categoryId} categories={categories} topics={topics!} />
}