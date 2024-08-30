"use client";
import { faChevronDown, faChevronRight, faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
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
import { ResourceItem, Topic, User } from "@prisma/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { withToast, request } from "@/lib/utils";

function AuthorList({ admins, authors } : {
  admins: User[], authors: React.MutableRefObject<string[]>
}){
  const [authorIds, setAuthorIds] = useState(authors.current);
  const [open, setOpen] = useState(false);
  authors.current = authorIds;
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="font-bold hover:text-gray-500 dark:hover:text-gray-300 transition">
        Authors
        <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} className="ml-2" />
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <ToggleGroup type="multiple" value={authorIds} onValueChange={setAuthorIds} className="justify-start">
          {admins.map(a => (
            <ToggleGroupItem key={a.id} value={a.id}>{a.name || a.dcUserName}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface DialogProps {
  asChild?: boolean;
  title?: string;
  id?: string;
  description?: string;
  isPublic?: boolean;
  topicId?: string;
  topics: Topic[];
  dialogTitle: string;
  dialogDescription: string;
  button: string;
  children: React.ReactNode;
  authors: User[];
  admins: User[];
  onClick: (id: string, title: string, description: string | null, categoryId: string, pub: boolean, authors: string[]) => any;
}

function ResourceDialog({ asChild = false, isPublic = false, title, description, id, topicId, topics, authors, admins, dialogTitle, dialogDescription, button, children, onClick } : DialogProps){
  const titleRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const authorsRef = useRef<string[]>(authors.map(a => a.id));
  const [topic, setTopic] = useState<string | undefined>(topicId);
  const [pub, setPub] = useState(isPublic);
  function handleClick(){
    if (!titleRef.current!.value.trim() || !idRef.current!.value.trim() || !topic) return;
    onClick(idRef.current!.value.trim(), titleRef.current!.value.trim(), descRef.current!.value.trim() || null, topic!, pub, authorsRef.current);
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
        <div>
          <Checkbox id={`checkbox-${id}`} checked={pub} onCheckedChange={pub => setPub(typeof pub === "boolean" ? pub : false)} />
          <label htmlFor={`checkbox-${id}`} className="ml-2">Public</label>
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
        <AuthorList authors={authorsRef} admins={admins} />
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

interface AdminTopicsProps {
  category: { id: string, name: string },
  topicId: string,
  topics: Topic[],
  resources: (ResourceItem & { authors: User[] })[]
  admins: User[]
}

export default function AdminResources({ category, topicId, topics, resources, admins } : AdminTopicsProps) {
  const router = useRouter();
  const { toast } = useToast();
  async function createResource(id: string, title: string, description: string | null, topicId: string, pub: boolean, authors: string[]){
    await request("/api/admin/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, title, description, topicId, public: pub, authors })
    });
    router.refresh();
  }
  const topicName = topics.find(c => c.id === topicId)?.name;
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
              <BreadcrumbLink href={`/admin/resources/${category.id}`}>{category.name}</BreadcrumbLink>
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
        <span className="md:hidden text-4xl">{topicName}</span>
        <ResourceDialog
          dialogTitle="Create Resource"
          dialogDescription="Create a new resource"
          button="Create"
          onClick={withToast(toast, createResource, "Created resource successfully!")}
          topics={topics}
          topicId={topicId}
          authors={[]}
          admins={admins}
          asChild
        >
          <Button variant="outline" size="icon" className="ml-2 hover:bg-green-500 hover:text-white transition cursor-pointer">
            <FontAwesomeIcon icon={faPlus} className="text-3xl" />
          </Button>
        </ResourceDialog>
      </h1>
      <ul className="mx-5">
        {resources.map(c => {
          async function editResource(id: string, title: string, description: string | null, topicId: string, pub: boolean, authors: string[]){
            await request(`/api/admin/resources/${c.topicId}/${c.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({id, title, description, topicId, public: pub, authors})
            });
            router.refresh();
          }
          async function deleteResource(){
            await request(`/api/admin/resources/${c.topicId}/${c.id}`, {
              method: "DELETE"
            });
            router.refresh();
          }
          return (
            <li key={c.id} className="shadow-md rounded-lg text-center bg-sky-100 dark:bg-gray-800 py-5 px-8 hover:scale-105 transition mb-5 flex items-center justify-between">
              <a href={`/admin/resources/${category.id}/${topicId}/${c.id}`}>{c.title}</a>
              <span className="flex justify-end items-center">
                <ResourceDialog
                  title={c.title}
                  id={c.id}
                  topicId={topicId}
                  description={c.description || undefined}
                  isPublic={c.public}
                  dialogTitle="Edit Resource"
                  dialogDescription={`Edit the ${c.title} resource`}
                  button="Save"
                  topics={topics}
                  authors={c.authors}
                  admins={admins}
                  onClick={withToast(toast, editResource, "Edited resource successfully!")}
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="ml-2 h-4 hover:text-blue-500 transition cursor-pointer" />
                </ResourceDialog>
                <AlertDialog onClick={withToast(toast, deleteResource, "Deleted resource successfully!")}>
                  This action cannot be undone. This will permanently delete resource &ldquo;{c.title}&rdquo;.
                </AlertDialog>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  )
}