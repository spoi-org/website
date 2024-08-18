import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {PrismaClient} from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;



export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
