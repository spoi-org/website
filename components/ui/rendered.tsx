import Markdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";

export default function Rendered(opts: Options){
  try {
    return (
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        {...opts}
        components={{
          code(props) {
            const {children, className, node, ...rest} = props
            const match = /language-(\w+)/.exec(className || "")
            return match ? (
              // @ts-ignore
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children || "").replace(/\n$/, "")}
                language={match[1]}
                style={oneLight}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          }
        }}
      />
    )
  } catch(e) {
    return <div>{String(e)}</div>;
  }
}