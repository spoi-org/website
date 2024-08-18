const { PrismaClient } = require("@prisma/client");
let id = "-1";

for (const arg of process.argv)
    if (arg.startsWith("--id="))
        id = arg.substring(5);

if (id === "-1") {
    console.log("No ID provided");
    process.exit(1);
}

const client = new PrismaClient();

(async () => {
    await client.user.update({
        where: {
            id
        },
        data: {
            admin: true
        }
    });
    console.log("Made user admin");
    process.exit(0);
})();