"use client"

import katex from "katex";
import { useEffect, useRef } from "react"
import * as marked from 'marked'
export default function LatexRenderer(props: { md: string }) {
    let divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        console.log("e")
        if (divRef.current) {
            divRef.current.querySelectorAll("latex").forEach(x=>{
                let a = x.innerHTML;
                x.innerHTML = ""
                katex.render(a, x as HTMLElement, {
                    output: "mathml"
                });
            });
        }

    })
    return <div dangerouslySetInnerHTML={{ __html: marked.parse(props.md
    ) }} ref={divRef} className="[&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl [&_h4]:text-3xl [&_h5]:text-2xl [&_h6]:text-xl">

    </div>
}