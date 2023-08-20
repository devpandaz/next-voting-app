import prisma from "../../../../prisma/prisma";
import VotingForm from "@/components/VotingForm";

export default async function Page({ params }) {
  const { questionId } = params;

  const question = await prisma.question.findUniqueOrThrow({
    where: {
      id: parseInt(questionId),
    },
    include: {
      choices: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  return <VotingForm question={question} />;
}

export async function generateMetadata({ params }) {
  const { questionId } = params;

  const question = await prisma.question.findUniqueOrThrow({
    where: {
      id: parseInt(questionId),
    },
  });

  return {
    title: question.questionText,
  };
}

export async function generateStaticParams() {
  const questions = await prisma.question.findMany();
  return questions.map((question) => ({
    questionId: question.id.toString(),
  }));
}

export const dynamic = "force-dynamic";
