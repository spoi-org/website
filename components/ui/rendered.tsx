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
import { HTMLAttributes, useContext } from "react";
import { ThemeContext } from "@/lib/context";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./table";

export default function Rendered({ className, ...opts } : Options){
  const { mode }  = useContext(ThemeContext);
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
            return match ? (
              // @ts-ignore
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                language={match[1]}
                style={mode ? oneDark : oneLight}
              >{String(children || "").replace(/\n$/, "")}</SyntaxHighlighter>
            ) : (
              <code {...rest} className={cn("bg-gray-300 dark:bg-gray-700 p-1 rounded-md", className)}>
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