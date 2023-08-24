import Question from "@/components/Question";
import prisma from "@/prisma/prisma";

export default function Page({ params }) {
  const { questionId } = params;
  return <Question questionId={questionId} />;
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
