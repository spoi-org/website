import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cache } from "@/lib/utils.server";
import Link from "next/link";
import { Metadata } from "next/types";
export async function generateMetadata({ params }: { params: { categoryId: string } }): Promise<Metadata> {

  return {
    title: "SPOI | " + cache.topic.get(params.categoryId)?.name,
    description: "A list of topics with the category " + cache.topic.get(params.categoryId)?.name,
    openGraph: {
      type: "website",
      title: "SPOI | " + cache.topic.get(params.categoryId)?.name,
      description: "A list of topics with the category " + cache.topic.get(params.categoryId)?.name,

    },
    keywords: "inoi,ioi,ioitc,indian olympiad,competitive programming,spoi,iarcs,newbie,learn"

  };
}
export default async function Topics({ params }: { params: { categoryId: string } }) {
  if (!cache.category.get(params.categoryId)) {
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
  const categoryName = cache.category.filter(c => c.id === params.categoryId)[0]?.name;
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
      "name": categoryName
    }]
  }
  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD2) }}
        />
      </section>
      <div className="text-lg flex flex-col justify-center items-center">
        <h1 className="font-bold my-10 flex justify-center items-center">
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList className="text-4xl">
              <BreadcrumbItem>
                <BreadcrumbLink href="/resources">Categories</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{categoryName}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">Topics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <span className="md:hidden text-4xl">{categoryName}</span>
        </h1>
        <ul className="mx-5">
          {topics.map(c => (
            <Link key={c.id} href={`/resources/${params.categoryId}/${c.id}`}>
              <li className="shadow-md rounded-lg text-center bg-sky-100 dark:bg-gray-800 py-5 px-8 hover:scale-105 transition mb-5">
                {c.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  )
}