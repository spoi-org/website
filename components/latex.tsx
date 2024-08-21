"use client";
import { useEffect, useRef } from "react";

export default function Latex({ children, ...props } : { children: React.ReactNode }){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const timeout = setTimeout(async () => {
      if (!ref.current) return;
      const resp = await fetch("/api/latex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: children })
      });
      if (!resp.ok) return;
      const body = await resp.json();
      if (body.html)
        ref.current.innerHTML = body.html;
      else if (body.error)
        ref.current.innerHTML = `<pre class="text-red-500">${body.error}</pre>`;
    }, 2000);
    return () => clearTimeout(timeout);
  }, [children]);
  return <div ref={ref} {...props} />
}