import { PrismaClient, User } from '@prisma/client'
import { cookies } from 'next/headers';

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;



export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

let auths: Record<string, User | undefined> = {}
export const findUserBySessionId = async () => {

  const store = cookies();
  let sessionId = store.get("__ssid")?.value;
  if (!sessionId) {
    return undefined;
  }
  if (sessionId in auths) {
    return auths[sessionId];
  }
  auths[sessionId] = (await prisma.sessionId.findUnique({
    where: {
      id: sessionId
    },
    select: {
      user: true
    }
  }))?.user;
  return auths[sessionId];
}