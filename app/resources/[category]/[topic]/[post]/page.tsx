import { prisma } from "@/lib/utils.server"
import { redirect } from "next/navigation"
import { existsSync } from 'fs';
import { readFile, writeFile } from "fs/promises";
import { Metadata } from "next";
import * as marked from 'marked';
import LatexRenderer from "@/components/ui/latex-renderer";
export async function generateMetadata({ params }: {params: { post: string }}): Promise<Metadata> {
    let post = await prisma.resourceItem.findUnique({
        where: {
            id: params.post
        },
        select: {
            title: true,
            content: true,
            // createdAt: true,
            // topic: {
            //     select: {
            //         id: true,
            //         name: true,
            //         category: {
            //             select: {
            //                 id: true,
            //                 name: true
            //             }
            //         }
            //     }
            // }
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
    if (!post) {
        return redirect("/")
    }

    return <div>
        <div></div>
        <div>{post.topic.category.name} &gt; {post.topic.name} &gt; {post.title}</div>
        <div>{post.createdAt.toDateString()}</div>
        <LatexRenderer md={post.content} />
    </div>
    
}