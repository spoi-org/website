import { prisma } from "@/lib/utils.server"
import { redirect } from "next/navigation"
import { existsSync } from 'fs';
import { readFile } from "fs/promises";
import { exec, execSync } from "child_process";
import internal, { Readable } from "stream";


export default async function Page({ params }: { params: { post: string } }) {
    console.log(params.post);
    let post = await prisma.blogPost.findUnique({
        where: {
            url: params.post
        },
        include: {
            topic: {
                include: {
                    category: true
                }
            }
        }
    })
    console.log(!post);
    if (!post) {
        return redirect("/")
    }
    if (!existsSync("blogCache/"+post.id+".html")) {
        execSync("pandoc -f markdown -o blogCache/"+post.id+".html", {
            input: post.content
        });
    }
        
        

    return <div>
        <div></div>
        <div>{post.topic.category.name} &gt; {post.topic.name} &gt; {post.title}</div>
        <div>{post.createdAt.toDateString()}</div>
        <div dangerouslySetInnerHTML={{__html: (await readFile("blogCache/"+post.id+".html")).toString("utf8")}}>
            
        </div>
    </div>
    
}