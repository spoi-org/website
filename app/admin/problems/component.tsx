"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../../components/ui/command";
import { Problem } from "@prisma/client";
import { useToast } from "../../../components/ui/use-toast";
import { withToast, request } from "../../../lib/utils";

export default function AdminProblems({ problems } : { problems: Problem[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const ratingRef = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState<Problem | undefined>();
  useEffect(() => {
    if (titleRef.current) titleRef.current.value = problem?.title || "";
    if (idRef.current) idRef.current.value = problem?.id || "";
    if (urlRef.current) urlRef.current.value = problem?.url || "";
    if (ratingRef.current) ratingRef.current.value = problem?.ratingEstimate.toString() || "";
  }, [problem]);
  async function createProblem(){
    const title = titleRef.current!.value.trim();
    const id = idRef.current!.value.trim();
    const url = urlRef.current!.value.trim();
    const ratingEstimate = parseInt(ratingRef.current!.value.trim());
    if (!title || !id || !url || !ratingEstimate) return;
    await request("/api/admin/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, id, url, ratingEstimate }),
    });
    router.refresh();
  }
  async function editProblem(){
    if (!problem) return;
    const title = titleRef.current!.value.trim();
    const id = idRef.current!.value.trim();
    const url = urlRef.current!.value.trim();
    const ratingEstimate = parseInt(ratingRef.current!.value.trim());
    if (!title || !id || !url || !ratingEstimate) return;
    await request(`/api/admin/problems/${problem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, id, url, ratingEstimate }),
    });
    router.refresh();
  }
  async function deleteProblem(){
    if (!problem) return;
    await request(`/api/admin/problems/${problem.id}`, {
      method: "DELETE"
    });
    setProblem(undefined);
    router.refresh();
  }
  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-5xl font-bold mb-10 flex justify-center items-center">
        Problems
      </h1>
      <div className="w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mb-5">
        <Command value={problem?.id} className="p-5 !max-h-[30vh]">
          <CommandInput placeholder="Search problems by name, id, or url..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Create">
              <CommandItem onSelect={() => setProblem(undefined)}>New Problem</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Problems">
              {problems.map((problem) => (
                <CommandItem
                  key={problem.id}
                  value={problem.id}
                  keywords={[problem.id, problem.title, problem.url]}
                  onSelect={nw => setProblem(problems.find(p => p.id === nw))}
                >{problem.title}</CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <h2 className="text-2xl font-bold mb-5">{problem ? `Editing ${problem.title}` : "New Problem"}</h2>
      <div className="mt-1 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
        <label htmlFor="title-input" className="block font-bold">Name</label>
        <input ref={titleRef} id="title-input" type="text" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-[#020817] mt-1" />
      </div>
      <div className="mt-1 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
        <label htmlFor="id-input" className="block font-bold">ID</label>
        <input ref={idRef} id="id-input" type="text" className="w-full p-2 border border-gray-300 dark:bg-[#020817] rounded-lg mt-1" />
      </div>
      <div className="mt-1 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
        <label htmlFor="url-input" className="block font-bold">URL</label>
        <input ref={urlRef} id="url-input" type="text" className="w-full p-2 border border-gray-300 dark:bg-[#020817] rounded-lg mt-1" />
      </div>
      <div className="mt-1 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
        <label htmlFor="rating-input" className="block font-bold">Rating Estimate</label>
        <input ref={ratingRef} id="rating-input" type="number" min={800} max={3500} step={100} className="w-full p-2 border border-gray-300 dark:bg-[#020817] rounded-lg mt-1" />
      </div>
      {problem ? (
        <div className="mt-5">
          <Button onClick={withToast(toast, editProblem, "Edited problem successfully!")} className="mr-5">Save Changes</Button>
          <Button onClick={withToast(toast, deleteProblem, "Deleted problem successfully!")} variant="destructive">Delete Problem</Button>
        </div>
      ) : (
        <Button onClick={withToast(toast, createProblem, "Created problem successfully!")} className="mt-5">Create Problem</Button>
      )}
    </div>
  );
}