import { Button } from "@/components/ui/button";
import Rendered from "@/components/ui/rendered";
import { cache } from "@/lib/utils.server";
import Link from "next/link";

export default async function ResourceEditor({ params } : { params: { resourceId: string } }){
  const resource = cache.resourceItem.get(params.resourceId);
  if (resource === undefined){
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
        <h1 className="text-4xl font-extrabold">404</h1>
        <p className="text-xl">Resource not found</p>
        <Link href="/">
          <Button className="text-lg">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }
  const authors = cache.author.get(params.resourceId)!;
  return (
    <div className="text-lg flex-grow mx-[10%]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{resource.title}</h1>
        <h2 className="text-gray-500 mt-1">Authors:&nbsp;{authors.filter(a => a.name).map(a => a.name).join(", ")}</h2>
      </div>
      <p className="italic mb-4">{resource.description}</p>
      <Rendered>{resource.content}</Rendered>
    </div>
  )
}