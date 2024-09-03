import { cache, ratingCache } from "./lib/utils.server";
import ora from "ora";

interface CFUser {
  handle: string;
  maxRating: number;
}

async function ratingsTask(){
  const resp = await fetch(`https://codeforces.com/api/user.info?handles=${Object.keys(ratingCache).join(";")}`);
  let data;
  try {
    data = await resp.json();
  } catch {
    console.error("[cf] ERROR: Codeforces API down");
    return;
  }
  if (data.status !== "OK") {
    console.error(`[cf] ERROR: ${data.comment}`);
    return;
  }
  Object.assign(ratingCache, Object.fromEntries(data.result.map((user: CFUser) => [user.handle, user.maxRating])));
}

export async function register(){
  const instances = Object.values(cache);
  const message = `Initializing cache instances [$/${instances.length+1}]`;
  const spinner = ora({ text: message.replace("$", "0"), indent: 1 }).start();
  const update = () => {
    cnt++;
    spinner.text = message.replace("$", cnt.toString());
  }
  let cnt = 0;
  await Promise.all([
    ratingsTask().then(update),
    ...instances.map(instance => instance.init().then(update))
  ]);

  spinner.succeed("All cache instances initialized");
}