import { prisma } from "@/lib/utils.server"
import { redirect } from "next/navigation"
import { existsSync } from 'fs';
import { readFile } from "fs/promises";
import { exec, execSync } from "child_process";
import internal, { Readable } from "stream";
import { Metadata } from "next";

export async function generateMetadata({ params }: {params: { post: string }}): Promise<Metadata> {
    let post = await prisma.resourceItem.findUnique({
        where: {
            id: params.post
        },
        select: {
            title: true,
            content: true,
            createdAt: true,
            topic: {
                select: {
                    id: true,
                    name: true,
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        }
    })
    if (!post) {
        return {
            title: "SPOI | 404 Not Found"
        }
    }
    return {
      title: post.title,
      description: post.content,
    };
}

export default async function Page({ params }: { params: { post: string, topic: string, category: string } }) {
    
    console.log(params.topic);
    let post = await prisma.resourceItem.findUnique({
        where: {
            id: params.post
            
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