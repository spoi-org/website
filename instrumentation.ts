import { cache } from "./lib/utils.server";

function reset(){
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
}

export async function register(){
  const instances = Object.values(cache);
  const message = `Initializing cache instances [$/${instances.length}]`;
  let cnt = 0;
  await Promise.all(instances.map(async (instance) => {
    await instance.init();
    cnt++;
    reset();
    process.stdout.write(message.replace("$", cnt.toString()));
  }));
  reset();
  console.log("All cache instances initialized");
}