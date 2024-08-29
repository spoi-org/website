import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.URL + '/',
      lastModified: new Date()
    },
    {
      url: process.env.URL + '/team',
      lastModified: new Date()
    }
  ]
}