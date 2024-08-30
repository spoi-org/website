import { cache, prisma } from "../../lib/utils.server"
import { MetadataRoute } from "next/types"

const BASE_URL = process.env.URL!;

export async function generateSitemaps() {
    
    return [...Array.from(Array(Math.ceil(cache.resourceItem.count() / 50000)).keys()).map(i => ({ id: "resourceItem_"+i })), 
        ...Array.from(Array(Math.ceil(cache.category.count() / 50000)).keys()).map(i => ({ id: "category_"+i })), 
        ...Array.from(Array(Math.ceil(cache.topic.count() / 50000)).keys()).map(i => ({ id: "topic_"+i }))]
}

export default async function sitemap({
    id,
}: {
    id: string,
}): Promise<MetadataRoute.Sitemap> {
    // Google's limit is 50,000 URLs per sitemap
    let [type, id2] = id.split("_");
    console.log(id)
    switch (type) {
        case "resourceItem":
            return cache.resourceItem.all().slice(+id2*50000, (1+(+id2))*50000).map((z) => ({ url: BASE_URL+"/resources/" + cache.topic.get(z.topicId)?.categoryId + "/" + z.topicId + "/" + z.id, lastModified: z.updatedAt }))
        case "topic":
            return cache.topic.all().slice(+id2*50000, (1+(+id2))*50000).map((z) => ({ url: BASE_URL+"/resources/" + z.categoryId + "/" + z.id, lastModified: z.updatedAt }))
            
        case "category":
            return cache.category.all().slice(+id2*50000, (1+(+id2))*50000).map((z) => ({ url: BASE_URL+"/resources/" + z.id, lastModified: z.updatedAt }))
            
    }
    return [];
}