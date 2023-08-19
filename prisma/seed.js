const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const questionData = [
  {
    questionText: "example question 1",
    choices: {
      create: [
        {
          choiceText: "Choice 1",
        },
      ],
    },
  },
  {
    questionText: "example question 2",
    choices: {
      create: [
        {
          choiceText: "Choice 2",
        },
      ],
    },
  },
  {
    questionText: "example question 3",
    choices: {
      create: [
        {
          choiceText: "Choice 3",
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const q of questionData) {
    const question = await prisma.question.create({
      data: q,
    });
    console.log(`Created question with id: ${question.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
