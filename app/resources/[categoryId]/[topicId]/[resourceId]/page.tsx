import { Button } from "@/components/ui/button";
import Rendered from "@/components/ui/rendered";
import { cache, findUserBySessionId, prisma } from "@/lib/utils.server";
import { Metadata } from "next";
import Link from "next/link";
export async function generateMetadata({ params }: { params: { resourceId: string } }): Promise<Metadata> {

  return {
    title: "SPOI | " + cache.resourceItem.get(params.resourceId)?.title,
    description: "" + cache.resourceItem.get(params.resourceId)?.description,
    openGraph: {
      type: "article",
      title: cache.resourceItem.get(params.resourceId)?.title,
      description: "" + cache.resourceItem.get(params.resourceId)?.description,
      publishedTime: cache.resourceItem.get(params.resourceId)?.createdAt.toISOString(),
      modifiedTime: cache.resourceItem.get(params.resourceId)?.updatedAt.toISOString(),
      authors: (await prisma.resourceItem.findUnique({
        where: {
          id: params.resourceId
        }, select: {
          authors: {
            select: {
              name: true
            }
          }

        }
      }))?.authors.map(x => x.name + ""),
      section: cache.topic.get(cache.resourceItem.get(params.resourceId)?.topicId || "")?.name
    },

  };
}
export default async function ResourceEditor({ params }: { params: { resourceId: string } }) {
  const resource = cache.resourceItem.get(params.resourceId);
  if (resource === undefined || (!resource.public && !findUserBySessionId()!.admin)) {
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
  const problems = cache.problem.getCache();
  const solved = cache.solves.get(findUserBySessionId()!.id)!;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    articleSection: cache.topic.get(resource.topicId),
    abstract: resource.description,
    accessMode: "mathOnVisual",
    accessModeSufficient: ["mathOnVisual", "visual", "diagramOnVisual", "textual", "textOnVisual"],
    author: authors.filter((x)=>x.name).map(x => ({
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': x.name
    })),
    dateCreated: resource.createdAt.toISOString(),
    datePublished: resource.createdAt.toISOString(),
    dateModified: resource.updatedAt.toISOString(),
    headline: resource.title,

  }
  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </section>
      <div className="text-lg flex-grow mx-[10%]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{resource.title}</h1>
          <h2 className="text-gray-500 mt-1">Authors:&nbsp;{authors.filter(a => a.name).map(a => a.name).join(", ")}</h2>
        </div>
        <p className="italic mb-4">{resource.description}</p>
        <Rendered problems={problems} solved={solved}>{resource.content}</Rendered>
      </div>
    </>
  )
}