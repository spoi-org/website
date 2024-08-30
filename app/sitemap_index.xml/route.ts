import { cache } from "../../lib/utils.server";

const BASE_URL = process.env.URL!;

const generateSitemapLink = (url: string) =>
  `<sitemap><loc>${url}</loc></sitemap>`;
  
export async function GET() {
    let value = [...Array.from(Array(Math.ceil(cache.resourceItem.count() / 50000)).keys()).map(i => ({ id: "resourceItem_"+i })), 
        ...Array.from(Array(Math.ceil(cache.category.count() / 50000)).keys()).map(i => ({ id: "category_"+i })), 
        ...Array.from(Array(Math.ceil(cache.topic.count() / 50000)).keys()).map(i => ({ id: "topic_"+i }))]


  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${generateSitemapLink(BASE_URL+`/sitemap.xml`)}

        ${Array.from(value)
          .map((id) =>
            generateSitemapLink(BASE_URL+`/seo/sitemap/${id.id}.xml`),
          )
          .join('')} 
    </sitemapindex>`;

  return new Response(sitemapIndexXML, {
    headers: { 'Content-Type': 'text/xml' },
  });
}