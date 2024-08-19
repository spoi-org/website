"use client";
import { faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface DialogProps {
  asChild?: boolean;
  title?: string;
  id?: string;
  description?: string;
  topicId?: string;
  topics: Topic[];
  dialogTitle: string;
  dialogDescription: string;
  button: string;
  children: React.ReactNode;
  onClick: (id: string, title: string, description: string | null, categoryId: string) => any;
}

function ResourceDialog({ asChild = false, title, description, id, topicId, topics, dialogTitle, dialogDescription, button, children, onClick } : DialogProps){
  const titleRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [topic, setTopic] = useState<string | undefined>(topicId);
  function handleClick(){
    if (!titleRef.current!.value.trim() || !idRef.current!.value.trim() || !topic) return;
    onClick(idRef.current!.value.trim(), titleRef.current!.value.trim(), descRef.current!.value.trim() || null, topic!);
  }
  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="mt-1">
          <label htmlFor={`name-${id}`} className="block font-bold">Name</label>
          <input ref={titleRef} id={`name-${id}`} type="text" defaultValue={title} className="w-full p-2 border border-gray-300 rounded-lg dark:bg-[#101720] mt-1" />
        </div>
        <div className="mt-1">
          <label htmlFor={`id-${id}`} className="block font-bold">ID</label>
          <input ref={idRef} id={`id-${id}`} type="text" defaultValue={id} className="w-full p-2 border border-gray-300 dark:bg-[#101720] rounded-lg mt-1" />
        </div>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger>
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-1">
          <label htmlFor={`description-${id}`} className="block font-bold">Description</label>
          <textarea ref={descRef} id={`description-${id}`} className="w-full p-2 border border-gray-300 dark:bg-[#101720] rounded-lg mt-1" defaultValue={description} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleClick}>{button}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface Topic {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  title: string;
  description: string | null;
}

interface AdminTopicsProps {
  category: Topic,
  topicId: string,
  topics: Topic[],
  resources: Resource[]
}

export default function AdminResources({ category, topicId, topics, resources } : AdminTopicsProps) {
  const router = useRouter();
  async function createResource(id: string, title: string, description: string | null, topicId: string){
    await fetch("/api/admin/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, title, description, topicId })
    });
    router.refresh();
  }
  const topicName = topics.find(c => c.id === topicId)?.name;
  return (
    <div className="text-lg flex flex-col justify-center items-center">
      <h1 className="font-bold my-10 flex justify-center items-center">
        <Breadcrumb>
          <BreadcrumbList className="text-4xl">
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/categories/${category.id}`}>{category.name}</BreadcrumbLink>
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
        <ResourceDialog
          dialogTitle="Create Resource"
          dialogDescription="Create a new resource"
          button="Create"
          onClick={createResource}
          topics={topics}
          topicId={topicId}
          asChild
        >
          <Button variant="outline" size="icon" className="ml-2 hover:bg-green-500 hover:text-white transition cursor-pointer">
            <FontAwesomeIcon icon={faPlus} className="text-3xl" />
          </Button>
        </ResourceDialog>
      </h1>
      <ul className="grid">
        {resources.map(c => {
          async function editResource(id: string, title: string, description: string | null, topicId: string){
            await fetch(`/api/admin/resources/${c.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({id, title, description, topicId})
            });
            router.refresh();
          }
          async function deleteResource(){
            await fetch(`/api/admin/resources/${c.id}`, {
              method: "DELETE"
            });
            router.refresh();
          }
          return (
            <li key={c.id} className="shadow-md rounded-lg text-center bg-sky-100 dark:bg-gray-800 py-5 px-8 hover:scale-105 transition mb-5 grid grid-cols-2">
              <a href={`/admin/categories/${category.id}/${topicId}/${c.id}`}>{c.title}</a>
              <span className="flex justify-end items-center">
                <ResourceDialog
                  title={c.title}
                  id={c.id}
                  topicId={topicId}
                  description={c.description || undefined}
                  dialogTitle="Edit Resource"
                  dialogDescription={`Edit the ${c.title} resource`}
                  button="Save"
                  topics={topics}
                  onClick={editResource}
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="ml-2 h-4 hover:text-blue-500 transition cursor-pointer" />
                </ResourceDialog>
                <AlertDialog>
                  <AlertDialogTrigger>
                  <FontAwesomeIcon icon={faTrash} className="ml-2 h-4 hover:text-red-500 transition cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete resource "{c.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteResource}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  )
}