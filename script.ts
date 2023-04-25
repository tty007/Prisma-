import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.user.create({
    data: {
      name: "Niko",
      email: "niko@prisma.io",
      posts: {
        create: {
          title: "prisma_tutorial",
          content: "This is a Prisma Tutorial. Let's challenge!"
        }
      }
    }
  })
  console.log(result);
}

main().catch(e =>{
  throw e
}).finally(async() => {
  await prisma.$disconnect()
})