import { prisma } from "@/lib/utils.server";


export async function TopicsPage(){
    const topics = await prisma.topic.findMany({
        select: {
            id: true,
            name: true,
            category
        }
    });
    return (
        <div>
            {
                topics.map((topic)=><div key={topic.id}>{topic.name}</div>)
            }
        </div>
    )
}