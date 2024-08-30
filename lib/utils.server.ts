import {
  Category, PrismaClient, Problem, ResourceItem, SessionId, Topic, User, Prisma
} from '@prisma/client'
import { cookies } from 'next/headers';

class Cache<
  T extends { id: string },
  InsertArgs,
  UpdateArgs
> {
  private resource: string;
  private cache: Record<string, T> = {};

  constructor(resource: string) {
    this.resource = resource;
  }

  async init() {
    // @ts-ignore
    const data: T[] = await prisma[this.resource].findMany();
    this.cache = Object.fromEntries(data.map(d => [d.id, d]));
  }

  get(id: string): T | undefined {
    return this.cache[id];
  }

  filter(predicate: (d: T) => boolean) {
    return Object.values(this.cache).filter(predicate);
  }

  all<K extends keyof T>(...keys: K[]): Pick<T, K>[] {
    if (keys.length === 0)
      return Object.values(this.cache);
    return Object.values(this.cache).map(d => {
      const obj = keys.reduce((acc, key) => ({ ...acc, [key]: d[key] }), {} as Pick<T, K>);
      return obj;
    });
  }

  getCache() {
    return this.cache;
  }

  async insert(args: InsertArgs) {
    // @ts-ignore
    const data: T = await prisma[this.resource].create(args);
    return this.cache[data.id] = data;
  }

  async update(id: string, args: UpdateArgs) {
    // @ts-ignore
    const data: T = (await prisma[this.resource].update({ where: { id }, ...args }));
    if (id !== data.id)
      delete this.cache[id];
    return this.cache[data.id] = data;
  }

  upsert(id: string, args: { insert: InsertArgs, update: UpdateArgs }) {
    if (id in this.cache)
      return this.update(id, args.update);
    return this.insert(args.insert);
  }

  async delete(id: string) {
    // @ts-ignore
    await prisma[this.resource].delete({ where: { id } });
    this.remove(id);
  }

  remove(id: string) {
    delete this.cache[id];
  }

  count() {
    return Object.keys(this.cache).length;
  }
}

class ResourceCache {
  private cache: Record<string, Record<string, ResourceItem>> = {};

  async init() {
    const data = await prisma.resourceItem.findMany();
    this.cache = {};
    for (const d of data) {
      if (!(d.topicId in this.cache))
        this.cache[d.topicId] = {};
      this.cache[d.topicId][d.id] = d;
    }
  }

  get(topicId: string, id: string): ResourceItem | undefined {
    return (this.cache[topicId] || {})[id];
  }

  getTopic(topicId: string) : ResourceItem[] {
    if (!(topicId in this.cache))
      this.cache[topicId] = {};
    return Object.values(this.cache[topicId]);
  }

  all(): ResourceItem[] {
    return Object.values(this.cache).flatMap(Object.values);
  }

  getCache() {
    return this.cache;
  }

  async insert(args: Prisma.ResourceItemCreateArgs) {
    const data = await prisma.resourceItem.create(args);
    if (!(data.topicId in this.cache))
      this.cache[data.topicId] = {};
    return this.cache[data.topicId][data.id] = data;
  }

  async update(topicId: string, id: string, args: Omit<Prisma.ResourceItemUpdateArgs, "where">) {
    const data = (await prisma.resourceItem.update({ where: { id_topicId: { topicId, id } }, ...args }));
    if (!(topicId in this.cache))
      this.cache[topicId] = {};
    if (!(data.topicId in this.cache))
      this.cache[data.topicId] = {};
    if (id !== data.id || topicId !== data.topicId)
      delete this.cache[topicId][id];
    return this.cache[data.topicId][data.id] = data;
  }

  async delete(topicId: string, id: string) {
    await prisma.resourceItem.delete({ where: { id_topicId: { topicId, id }  }});
    if (this.cache[topicId])
      delete this.cache[topicId][id];
  }

  updateTopic(oldTopicId: string, newTopicId: string){
    this.cache[newTopicId] = this.cache[oldTopicId];
    delete this.cache[oldTopicId];
  }

  deleteTopic(topicId: string){
    delete this.cache[topicId];
  }

  count() {
    return Object.keys(this.cache).length;
  }
}

// does not handle user updates
class AuthorCache {
  private cache: Record<string, Record<string, User[]>> = {};

  async init() {
    const data = await prisma.resourceAuthors.findMany({
      select: { resourceId: true, topicId: true, author: true }
    });
    this.cache = {};
    for (const { resourceId, topicId, author } of data) {
      if (!(resourceId in this.cache))
        this.cache[resourceId] = {};
      if (!(topicId in this.cache[resourceId]))
        this.cache[resourceId][topicId] = [];
      this.cache[resourceId][topicId].push(author);
    }
  }

  get(topicId: string, id: string): User[] {
    return (this.cache[topicId] || {})[id] || [];
  }

  insert(topicId: string, id: string, authors: User[]) {
    if (!(topicId in this.cache))
      this.cache[topicId] = {};
    this.cache[topicId][id] = authors;
  }

  async update(topicId: string, id: string, authors: string[]) {
    if (!(topicId in this.cache))
      this.cache[topicId] = {};
    if (!(id in this.cache[topicId]))
      this.cache[topicId][id] = [];
    const toRemove: string[] = [];
    for (const author of this.cache[topicId][id])
      if (!authors.includes(author.id))
        toRemove.push(author.id);
    const toAdd: string[] = [];
    for (const author of authors)
      if (!this.cache[topicId][id].find(a => a.id === author))
        toAdd.push(author);
    if (toRemove.length > 0) {
      await prisma.resourceAuthors.deleteMany({
        where: {
          resourceId: id,
          topicId,
          authorId: { in: toRemove }
        }
      });
      this.cache[topicId][id] = this.cache[topicId][id].filter(a => !toRemove.includes(a.id));
    }
    if (toAdd.length > 0) {
      const data = await prisma.resourceAuthors.createManyAndReturn({
        data: toAdd.map(aid => ({ resourceId: id, topicId, authorId: aid })),
        include: {
          author: true
        }
      });
      for (const { author } of data)
        this.cache[topicId][id].push(author);
    }
  }

  updateTopic(oldTopicId: string, newTopicId: string){
    this.cache[newTopicId] = this.cache[oldTopicId];
    delete this.cache[oldTopicId];
  }

  deleteTopic(topicId: string){
    delete this.cache[topicId];
  }

  delete(topicId: string, id: string) {
    if (this.cache[topicId])
      delete this.cache[topicId][id];
  }
}

class SolverCache {
  private cache: Record<string, string[]> = {};

  async init() {
    const data = await prisma.user.findMany({
      select: { id: true, solved: true }
    });
    this.cache = Object.fromEntries(data.map(d => [d.id, d.solved.map(s => s.id)]));
  }

  get(id: string): string[] | undefined {
    return this.cache[id];
  }

  insert(id: string, solved: string[]) {
    this.cache[id] = solved;
  }

  async add(uid: string, pid: string) {
    const data = await prisma.user.update({
      where: { id: uid },
      data: {
        solved: {
          connect: { id: pid }
        }
      },
      include: {
        solved: {
          select: { id: true }
        }
      }
    });
    this.cache[uid] = data.solved.map(s => s.id);
  }

  async remove(uid: string, pid: string) {
    const data = await prisma.user.update({
      where: { id: uid },
      data: {
        solved: {
          disconnect: { id: pid }
        }
      },
      include: {
        solved: {
          select: { id: true }
        }
      }
    });
    this.cache[uid] = data.solved.map(s => s.id);
  }

  delete(id: string) {
    delete this.cache[id];
  }
}

function cacheSingleton() {
  return {
    user: new Cache<User, Prisma.UserCreateArgs, Omit<Prisma.UserUpdateArgs, "where">>("user"),
    sessionId: new Cache<SessionId, Prisma.SessionIdCreateArgs, Omit<Prisma.SessionIdUpdateArgs, "where">>("sessionId"),
    category: new Cache<Category, Prisma.CategoryCreateArgs, Omit<Prisma.CategoryUpdateArgs, "where">>("category"),
    topic: new Cache<Topic, Prisma.TopicCreateArgs, Omit<Prisma.TopicUpdateArgs, "where">>("topic"),
    problem: new Cache<Problem, Prisma.ProblemCreateArgs, Omit<Prisma.ProblemUpdateArgs, "where">>("problem"),
    resourceItem: new ResourceCache(),
    author: new AuthorCache(),
    solves: new SolverCache()
  }
}

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const ratingCacheSingleton = () => {
  return {
    "unforgettablepl": 0,
    "oviyan_gandhi": 0,
    "avighnakc": 0,
    "Dominater069": 0,
    "Everule": 0,
    "blue": 0,
    "evenvalue": 0,
    "PoPularPlusPlus": 0,
    "hariaakash646": 0,
    "astoria": 0,
    "rm1729": 0,
    "accord": 0,
    "saarang": 0,
    "ak2006": 0,
    "codula": 0,
    "OIaspirant2307": 0,
    "oddvalue": 0,
    "aaravmalani": 0,
    "Codula": 0
  }
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
  cacheGlobal: ReturnType<typeof cacheSingleton>;
  ratingCacheGlobal: ReturnType<typeof ratingCacheSingleton>;
} & typeof global;


export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export const cache = globalThis.cacheGlobal ?? cacheSingleton();
export const ratingCache = globalThis.ratingCacheGlobal ?? ratingCacheSingleton();

globalThis.prismaGlobal = prisma;
globalThis.cacheGlobal = cache;
globalThis.ratingCacheGlobal = ratingCache;

export function findUserBySessionId() {
  const store = cookies();
  let sessionId = store.get("__ssid")?.value;
  if (!sessionId)
    return undefined;
  return cache.user.get(cache.sessionId.get(sessionId)?.userId || "");
}
