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
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface DialogProps {
  asChild?: boolean;
  name?: string;
  id?: string;
  title: string;
  description: string;
  button: string;
  children: React.ReactNode;
  onClick: (id: string, name: string) => any;
}

function CategoryDialog({ asChild = false, name, id, title, description, button, children, onClick } : DialogProps){
  const nameRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  function handleClick(){
    if (!nameRef.current!.value.trim() || !idRef.current!.value.trim()) return;
    onClick(idRef.current!.value.trim(), nameRef.current!.value.trim());
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
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleClick}>{button}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface Category {
  id: string;
  name: string;
}

export default function AdminCategories({ categories } : { categories: Category[] }) {
  const router = useRouter();
  async function createCategory(id: string, name: string){
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, name })
    });
    router.refresh();
  }
  return (
    <div className="text-lg flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-10 flex justify-center items-center">
        Categories
        <CategoryDialog
          title="Create Category"
          description="Create a new category"
          button="Create"
          onClick={createCategory}
          asChild
        >
          <Button variant="outline" size="icon" className="ml-2 hover:bg-green-500 hover:text-white transition cursor-pointer">
            <FontAwesomeIcon icon={faPlus} className="text-3xl" />
          </Button>
        </CategoryDialog>
      </h1>
      <ul className="mx-5">
        {categories.map(c => {
          async function editCategory(id: string, name: string){
            await fetch(`/api/admin/categories/${c.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({id, name})
            });
            router.refresh();
          }
          async function deleteCategory(){
            await fetch(`/api/admin/categories/${c.id}`, {
              method: "DELETE"
            });
            router.refresh();
          }
          return (
            <li key={c.id} className="shadow-md rounded-lg text-center bg-sky-100 dark:bg-gray-800 py-5 px-8 hover:scale-105 transition mb-5 flex items-center justify-between">
              <a href={`/admin/resources/${c.id}`}>{c.name}</a>
              <span className="flex justify-end items-center">
                <CategoryDialog
                  name={c.name}
                  id={c.id}
                  title="Edit Category"
                  description={`Edit the ${c.name} category`}
                  button="Save"
                  onClick={editCategory}
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="ml-2 h-4 hover:text-blue-500 transition cursor-pointer" />
                </CategoryDialog>
                <AlertDialog onClick={deleteCategory}>
                  This action cannot be undone. This will permanently delete category &ldquo;{c.name}&rdquo;&nbsp;
                  <span className="font-extrabold">and all topics and resources within it.</span>
                </AlertDialog>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  )
}