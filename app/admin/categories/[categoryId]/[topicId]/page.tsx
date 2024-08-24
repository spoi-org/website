import { cache } from "@/lib/utils.server";
import AdminResources from "./component";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ResourcesPage({ params } : { params: { categoryId: string, topicId: string } }){
    const categoryName = cache.category.get(params.categoryId)?.name;
    if (!categoryName){
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
    if (!cache.topic.get(params.topicId)){
        <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
            <h1 className="text-4xl font-extrabold">404</h1>
            <p className="text-xl">Topic not found</p>
            <Link href="/">
                <Button className="text-lg">
                    Back to Home
                </Button>
            </Link>
        </div>
    }
    const resources = cache.resourceItem.filter(r => r.topicId == params.topicId);
    const topics = cache.topic.all();
    return <AdminResources category={{ name: categoryName!, id: params.categoryId }} topicId={params.topicId} topics={topics} resources={resources} />
}