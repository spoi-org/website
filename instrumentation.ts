import { cache } from "./lib/utils.server";
import ora from "ora";

export async function register(){
  const instances = Object.values(cache);
  const message = `Initializing cache instances [$/${instances.length}]`;
  const spinner = ora({ text: message.replace("$", "0"), indent: 1 }).start();
  let cnt = 0;
  await Promise.all(instances.map(async (instance) => {
    await instance.init();
    cnt++;
    spinner.text = message.replace("$", cnt.toString());
  }));
  spinner.succeed("All cache instances initialized");
}