"use client";
import LoaderButton from "@/components/ui/loader-button";
import Rendered from "@/components/ui/rendered";
import { useToast } from "@/components/ui/use-toast";
import { withToast, request } from "@/lib/utils";
import { Problem } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

interface Resource {
  id: string;
  topicId: string;
  title: string;
  description: string | null;
  content: string;
}

interface Author {
  id: string;
  name: string | null;
}

interface Props {
  problems: Record<string, Problem>;
  solved: string[];
  resource: Resource;
  authors: Author[];
}

export default function ResourceEditorComponent({ resource, authors, problems, solved } : Props){
  const { toast } = useToast();
  const [content, setContent] = useState(resource.content);

  const lastSaved = useRef(resource.content);
  function onBeforeUnload(event: BeforeUnloadEvent){
    if (lastSaved.current !== content){
      event.preventDefault();
      return "You have unsaved changes. Are you sure you want to leave?";
    }
  }
  function onLinkClick(event: MouseEvent){
    if (lastSaved.current !== content){
      const leave = confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!leave) event.preventDefault();
    }
  }
  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    const links = Array.from(document.getElementsByTagName("a")).filter(e => e.target !== "_blank");
    links.forEach(link => link.addEventListener("click", onLinkClick));
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      links.forEach(link => link.removeEventListener("click", onLinkClick));
    };
  });

  async function save(){
    await request(`/api/admin/resources/${resource.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...resource, content })
    });
    lastSaved.current = content;
  }
  return (
    <div className="grid grid-cols-2 flex-grow">
      <div className="relative w-full h-full">
        <textarea defaultValue={content} onInput={e => setContent(e.currentTarget.value)} className="w-full h-full dark:bg-gray-900 font-mono resize-none p-3 outline-none" />
        <LoaderButton className="absolute top-3 right-3" loadingText="Saving..." onClick={withToast(toast, save, "Saved Problem successfully!")}>
          Save
        </LoaderButton>
      </div>
      <div className="text-lg mx-5">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{resource.title}</h1>
          <h2 className="text-gray-500 mt-1">Authors:&nbsp;{authors.filter(a => a.name).map(a => a.name).join(", ")}</h2>
        </div>
        <p className="italic mb-4">{resource.description}</p>
        <Rendered problems={problems} solved={solved}>{content}</Rendered>
      </div>
    </div>
  )
}