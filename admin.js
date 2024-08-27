const { PrismaClient } = require("@prisma/client");
let admin = true;
let id = "-1";
let name = undefined;

for (const arg of process.argv){
  if (arg.startsWith("--id="))
    id = arg.substring(5);
  if (arg.startsWith("--name="))
    name = arg.substring(7);
  if (arg === "--disable")
    admin = false;
}

if (id === "-1") {
  console.log("No ID provided");
  process.exit(1);
}

const client = new PrismaClient();

(async () => {
  await client.user.update({
    where: { id },
    data: { admin, name }
  });
  console.log("Successfully updated user admin");
  process.exit(0);
})();