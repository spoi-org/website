import { cache } from "../../../../lib/utils.server";
import AdminTopics from "./component";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";

export default async function TopicsPage({ params } : { params: { categoryId: string } }){
  if (!cache.category.get(params.categoryId)){
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
        <h1 className="text-4xl font-extrabold">404</h1>
        <p className="text-xl">Category not found</p>
        <Link href="/">
          <Button className="text-lg">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }
  const topics = cache.topic.filter(t => t.categoryId == params.categoryId);
  const categories = cache.category.all();
  return <AdminTopics categoryId={params.categoryId} categories={categories} topics={topics!} />
}