import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash("changeme123", 10);

    const user = await prisma.user.upsert({
        where: { email: "admin@klyroframe.local" },
        update: {},
        create: {
            email: "admin@klyroframe.local",
            name: "Admin Klyro",
            passwordHash,
        },
    });

    console.log("-----------------------------------------");
    console.log("SOLO PARA DESARROLLO / CREDENCIALES:");
    console.log("Email: admin@klyroframe.local");
    console.log("Pass:  changeme123");
    console.log("-----------------------------------------");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
