import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/utils.server";
import Link from "next/link";
import ResourceEditorComponent from "./component";

export default async function ResourceEditor({ params } : { params: { resourceId: string } }){
  const resource = await prisma.resourceItem.findUnique({
    where: {
      id: params.resourceId
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      topicId: true
    }
  });
  if (!resource){
    <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
      <h1 className="text-4xl font-extrabold">404</h1>
      <p className="text-xl">Resource not found</p>
      <Link href="/">
        <Button className="text-lg">
          Back to Home
        </Button>
      </Link>
    </div>
  }
  const authors = await prisma.resourceItem.findUnique({
    where: {
      id: params.resourceId
    },
    include: {
      authors: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  return <ResourceEditorComponent resource={resource!} authors={authors!.authors} />
}