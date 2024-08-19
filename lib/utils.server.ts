import {PrismaClient} from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;



export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
prisma.blogPost.findMany().then(console.log)
prisma.blogPost.create({
  data: {
    content: "# Hello\n\n$$ x = y^2 + x_0$$",
    title: "Hello",
    url: "hello",
    topic: {
      create: {
        name: "INOI",
        category: {
          create: {
            name: "Editorials"
          }
        }
      }
    }
  }
})