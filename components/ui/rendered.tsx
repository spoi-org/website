"use client";
import "./rendered.css";
import Markdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";
import { ComponentProps, HTMLAttributes, useContext, useState } from "react";
import { ThemeContext } from "@/lib/context";
import { withToast, cn, request } from "@/lib/utils";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Problem } from "@prisma/client";
import { Checkbox } from "./checkbox";
import { Rating } from "./rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./button";
import { useToast } from "./use-toast";

interface RenderedProps extends Options {
  problems: Record<string, Problem>;
  solved: string[];
}

interface ProblemCheckboxProps {
  className?: string;
  problem: Problem;
  solves: string[];
  setSolves: (solves: string[]) => void;
}

function ProblemCheckbox({ problem, solves, setSolves, className } : ProblemCheckboxProps){
  async function onCheck(checked: boolean){
    if (checked === true){
      request(`/api/problems/${problem.id}`, { method: "POST" });
      setSolves([...solves, problem.id]);
    }
    else {
      request(`/api/problems/${problem.id}`, { method: "DELETE" });
      setSolves(solves.filter(s => s !== problem.id));
    }
  }
  return (
    <Checkbox
      aria-label={problem.title + " Checkbox"}
      checked={solves.includes(problem.id)} onCheckedChange={onCheck}
      className={cn("data-[state=checked]:bg-green-500 !text-white rounded-full", className)}
    />
  )
}

export default function Rendered({ className, problems, solved, ...opts } : RenderedProps){
  const { mode }  = useContext(ThemeContext);
  const { toast } = useToast();
  const [solves, setSolves] = useState(solved);
  try {
    return (
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        {...opts}
        className={cn("rendered", className)}
        components={{
          code(props) {
            const {children, className, node, ...rest} = props;
            const match = /language-(\w+)/.exec(className || "");
            const content = String(children || "").replace(/\n$/, "");
            function copy(){
              navigator.clipboard.writeText(content);
            }
            return match ? (
              <div className="relative">
                { /* @ts-ignore */ }
                <SyntaxHighlighter 
                  {...rest}
                  PreTag="div"
                  language={match[1]}
                  style={mode ? oneDark : oneLight}
                >{content}</SyntaxHighlighter>
                <Button className="absolute top-0 right-0" onClick={withToast(toast, copy, "Copied!")}>
                  Copy
                </Button>
              </div>
            ) : (
              <code {...rest} className={cn("bg-gray-300 dark:bg-gray-700 p-1 rounded-md relative", className)}>
                {children}
              </code>
            );
          },
          // @ts-ignore
          yt: ({ children, className, ...props }) => {
            return (
            <span className="flex justify-center items-center">
              <iframe
                src={`https://youtube.com/embed/${children}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className={cn("py-5 w-full md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] aspect-video", className)}
                {...props}
              />
            </span>
          )},
          // problems
          problem: ({ children, className, ...props } : ComponentProps<"div">) => {
            const problem = problems[children as string];
            if (problem === undefined)
              return <div className={cn("text-red-500", className)} {...props}>Problem not found</div>;
            return (
              <span className={cn("flex justify-center items-center", className)} {...props}>
                <span className="border-2 rounded-md bg-sky-100 dark:bg-gray-800 hover:-translate-y-1 transition p-5 flex justify-center items-center w-full md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]">
                  <a href={problem.url} target="_blank" className="flex-1 text-xl font-bold">
                    <span className="inline-flex flex-col">
                      {problem.title}
                      <Rating rating={problem.ratingEstimate} className="text-base" />
                    </span>
                    <FontAwesomeIcon icon={faLink} className="ml-2" />
                  </a>
                  <ProblemCheckbox className="h-10 w-10 text-xl mr-2 flex-shrink-0" problem={problem} solves={solves} setSolves={setSolves} />
                </span>
              </span>
            );
          },
          ptable: ({ children, className, ...props } : ComponentProps<"table">) => {
            return (
              <div className="flex justify-center items-center">
                <div className="w-full md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]">
                  <Table className={cn("my-5 border", className)} {...props}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Problem</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-center">Solved</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {children}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          },
          prow: ({ children, ...props } : ComponentProps<"tr">) => {
            const problem = problems[children as string];
            if (problem === undefined){
              return (
                <TableRow className={cn("text-red-500", className)} {...props}>
                  <TableCell>Problem not found</TableCell>
                  <TableCell /><TableCell />
                </TableRow>
              );
            }
            return (
              <TableRow {...props}>
                <TableCell>
                  <a href={problem.url}>{problem.title}</a>
                </TableCell>
                <TableCell><Rating rating={problem.ratingEstimate} /></TableCell>
                <TableCell className="text-center !pr-4">
                  <ProblemCheckbox className="h-6 w-6" problem={problem} solves={solves} setSolves={setSolves} />
                </TableCell>
              </TableRow>
            );
          },
          // table
          table: ({ className, ...props }) => <Table className={cn("my-5", className)} {...props} />,
          thead: props => <TableHeader {...props} />,
          tbody: props => <TableBody {...props} />,
          th: ({ className, ...props }) => <TableHead className={cn("border-2", className)} {...props} />,
          tr: props => <TableRow {...props} />,
          td: ({ className, ...props }) => <TableCell className={cn("border-2", className)} {...props} />,
          caption: (props: HTMLAttributes<HTMLTableCaptionElement>) => <TableCaption {...props} />,
          // headings
          h1: ({ className, ...props }) => <h1 className={cn("text-3xl font-bold mb-1", className)} {...props} />,
          h2: ({ className, ...props }) => <h2 className={cn("text-2xl font-bold", className)} {...props} />,
          h3: ({ className, ...props }) => <h3 className={cn("text-xl font-bold", className)} {...props} />,
          h4: ({ className, ...props }) => <h4 className={cn("text-base", className)} {...props} />,
          h5: ({ className, ...props }) => <h5 className={cn("text-sm", className)} {...props} />,
          h6: ({ className, ...props }) => <h6 className={cn("text-xs", className)} {...props} />,
          // lists
          ul: ({ className, ...props }) => <ul className={cn("list-disc pl-5 my-2 rendered-list", className)} {...props} />,
          ol: ({ className, ...props }) => <ol className={cn("list-decimal pl-5 my-2 rendered-list", className)} {...props} />,
          // others
          a: ({ className, ...props }) => <a className={cn("underline hover:text-gray-500 dark:hover:text-gray-300 transition", className)} {...props} />,
          blockquote: ({ className, ...props }) => <blockquote className={cn("border-l-4 pl-4 my-5 text-gray-500 text-base", className)} {...props} />,
          hr: ({ className, ...props }) => <hr className={cn("my-5 border-gray-300 dark:border-gray-700", className)} {...props} />,
        }}
      />
    )
  } catch(e) {
    return <div>{String(e)}</div>;
  }
}