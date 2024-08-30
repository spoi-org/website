"use client";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog
} from "@/components/ui/responsive-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { withToast, request } from "@/lib/utils";
import { Category } from "@prisma/client";

interface DialogProps {
  asChild?: boolean;
  name?: string;
  id?: string;
  categoryId?: string;
  categories: Category[];
  title: string;
  description: string;
  button: string;
  children: React.ReactNode;
  onClick: (id: string, name: string, categoryId: string) => any;
}

function TopicDialog({ asChild = false, name, id, categoryId, categories, title, description, button, children, onClick } : DialogProps){
  const nameRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string | undefined>(categoryId);
  function handleClick(){
    if (!nameRef.current!.value.trim() || !idRef.current!.value.trim() || !category) return;
    onClick(idRef.current!.value.trim(), nameRef.current!.value.trim(), category!);
  }
  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-1">
          <label htmlFor={`name-${id}`} className="block font-bold">Name</label>
          <input ref={nameRef} id={`name-${id}`} type="text" defaultValue={name} className="w-full p-2 border border-gray-300 rounded-lg dark:bg-[#101720] mt-1" />
        </div>
        <div className="mt-1">
          <label htmlFor={`id-${id}`} className="block font-bold">ID</label>
          <input ref={idRef} id={`id-${id}`} type="text" defaultValue={id} className="w-full p-2 border border-gray-300 dark:bg-[#101720] rounded-lg mt-1" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleClick}>{button}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminCategories(
  { categoryId, categories, topics } : { categoryId: string, categories: Category[], topics: Category[] }
) {
  const router = useRouter();
  const { toast } = useToast();
  async function createTopic(id: string, name: string, categoryId: string){
    await request("/api/admin/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, name, categoryId })
    });
    router.refresh();
  }
  const categoryName = categories.find(c => c.id === categoryId)?.name;
  return (
    <div className="text-lg flex flex-col justify-center items-center">
      <h1 className="font-bold my-10 flex justify-center items-center">
        <Breadcrumb className="hidden md:block">
          <BreadcrumbList className="text-4xl">
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/resources">Categories</BreadcrumbLink>
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
        <TopicDialog
          title="Create Topic"
          description="Create a new topic"
          button="Create"
          onClick={withToast(toast, createTopic, "Created topic successfully!")}
          categories={categories}
          categoryId={categoryId}
          asChild
        >
          <Button variant="outline" size="icon" className="ml-2 hover:bg-green-500 hover:text-white transition cursor-pointer">
            <FontAwesomeIcon icon={faPlus} className="text-3xl" />
          </Button>
        </TopicDialog>
      </h1>
      <ul className="mx-5">
        {topics.map(c => {
          async function editTopic(id: string, name: string, categoryId: string){
            await request(`/api/admin/topics/${c.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({id, name, categoryId})
            });
            router.refresh();
          }
          async function deleteTopic(){
            await request(`/api/admin/topics/${c.id}`, {
              method: "DELETE"
            });
            router.refresh();
          }
          return (
            <li key={c.id} className="shadow-md rounded-lg text-center bg-sky-100 dark:bg-gray-800 py-5 px-8 hover:scale-105 transition mb-5 flex items-center justify-between">
              <a href={`/admin/resources/${categoryId}/${c.id}`}>{c.name}</a>
              <span className="flex justify-end items-center">
                <TopicDialog
                  name={c.name}
                  id={c.id}
                  categoryId={categoryId}
                  title="Edit Topic"
                  description={`Edit the ${c.name} topic`}
                  button="Save"
                  categories={categories}
                  onClick={withToast(toast, editTopic, "Edited topic successfully!")}
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="ml-2 h-4 hover:text-blue-500 transition cursor-pointer" />
                </TopicDialog>
                <AlertDialog onClick={withToast(toast, deleteTopic, "Deleted topic successfully!")}>
                  This action cannot be undone. This will permanently delete topic &ldquo;{c.name}&rdquo;&nbsp;
                  <span className="font-extrabold">and all resources within it.</span>
                </AlertDialog>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  )
}