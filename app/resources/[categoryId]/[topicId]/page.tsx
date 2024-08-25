import { cache } from "@/lib/utils.server";
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
  const admins = cache.user.filter(u => u.admin);
  const topicName = topics.find(c => c.id === params.topicId)?.name;
  return (
    <div className="text-lg flex flex-col justify-center items-center">
      <h1 className="font-bold my-10 flex justify-center items-center">
        <Breadcrumb>
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
      </h1>
      <ul className="grid">
        {resources.map(c => {
          return (
            <Link key={c.id} href={`/resources/${params.categoryId}/${params.topicId}/${c.id}`}>
              <li className="shadow-md rounded-lg text-center bg-sky-100 dark:bg-gray-800 py-5 px-8 hover:scale-105 transition mb-5">
                {c.title}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  )
}