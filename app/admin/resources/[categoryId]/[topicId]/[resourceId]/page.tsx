import { Button } from "@/components/ui/button";
import { cache, findUserBySessionId } from "@/lib/utils.server";
import Link from "next/link";
import ResourceEditorComponent from "./component";

export default async function ResourceEditor({ params } : { params: { resourceId: string } }){
  const resource = cache.resourceItem.get(params.resourceId);
  if (!resource){
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
  const authors = cache.author.get(params.resourceId);
  const problems = cache.problem.getCache();
  const solved = cache.solves.get(findUserBySessionId()!.id)!;
  return <ResourceEditorComponent resource={resource!} authors={authors!} problems={problems} solved={solved} />
}