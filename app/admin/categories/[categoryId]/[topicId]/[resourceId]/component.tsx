"use client";
import Rendered from "@/components/ui/rendered";
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  content: string;
}

interface Author {
  id: string;
  name: string | null;
}

export default function ResourceEditorComponent({ resource, authors } : { resource: Resource, authors: Author[] }){
  const [content, setContent] = useState(resource.content);
  return (
    <div className="grid grid-cols-2 space-x-5 flex-grow">
      <textarea defaultValue={content} onInput={e => setContent(e.currentTarget.value)} className="w-full h-full dark:bg-gray-900 font-mono resize-none p-3 outline-none" />
      <div className="text-lg">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{resource.title}</h1>
          <h2 className="text-gray-500 mt-1">Authors:&nbsp;{authors.filter(a => a.name).map(a => a.name).join(", ")}</h2>
        </div>
        <p className="italic mb-4">{resource.description}</p>
        <Rendered>{content}</Rendered>
      </div>
    </div>
  )
}