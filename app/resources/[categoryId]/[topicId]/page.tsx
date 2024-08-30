import { cache, findUserBySessionId } from "@/lib/utils.server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next/types";
export async function generateMetadata({ params }: { params: { topicId: string } }): Promise<Metadata> {

  return {
    title: "SPOI - " + cache.topic.get(params.topicId)?.name,
    description: "A list of resources with the topic " + cache.topic.get(params.topicId)?.name,
    openGraph: {
      type: "website",
      title: "SPOI - " + cache.topic.get(params.topicId)?.name,
      description: "A list of resources with the topic " + cache.topic.get(params.topicId)?.name,

    },
    keywords: "inoi,ioi,ioitc,indian olympiad,competitive programming,spoi,iarcs,newbie,learn"
  };
}
export default async function ResourcesPage({ params }: { params: { categoryId: string, topicId: string } }) {
  const categoryName = cache.category.get(params.categoryId)?.name;
  if (!categoryName) {
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
    )
  }
  if (!cache.topic.get(params.topicId)) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
        <h1 className="text-4xl font-extrabold">404</h1>
        <p className="text-xl">Topic not found</p>
        <Link href="/">
          <Button className="text-lg">
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }
  const admin = findUserBySessionId()!.admin;
  const resources = cache.resourceItem.filter(r => (
    r.topicId == params.topicId && (r.public || admin)
  ));
  const topics = cache.topic.all();
  const topicName = topics.find(c => c.id === params.topicId)?.name;
  const jsonLD2 = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Resources",
      "item": process.env.URL + "/resources/"
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": cache.category.get(cache.topic.get(params.topicId)?.categoryId || "")?.name,
      "item": process.env.URL + "/resources/" + cache.topic.get(params.topicId)?.categoryId
    }, {
      "@type": "ListItem",
      "position": 3,
      "name": cache.topic.get(params.topicId)?.name,

    }]
  }
  return (
    <><section><script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD2) }}
    /></section>
      <div className="text-lg flex flex-col justify-center items-center">
        <h1 className="font-bold my-10 flex justify-center items-center">
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList className="text-4xl">
              <BreadcrumbItem>
                <BreadcrumbLink href="/resources">Categories</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/resources/${params.categoryId}`}>{categoryName}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{topicName}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">Resources</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <span className="md:hidden text-4xl">{categoryName}</span>
        </h1>
        <ul className="mx-5">
          {resources.map(c => {
            const authors = cache.author.get(c.id)!;
            return (
              <Link key={c.id} href={`/resources/${params.categoryId}/${params.topicId}/${c.id}`}>
                <li className="shadow-md rounded-lg bg-sky-100 dark:bg-gray-800 py-5 px-8 hover:scale-105 transition mb-5">
                  <h2 className="text-2xl font-bold">{c.title}</h2>
                  {authors.length > 0 && <span className="text-sm">By {authors.map((x) => x.name).join(", ")}</span>}
                  <p className="text-lg italic">{c.description}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  )
}