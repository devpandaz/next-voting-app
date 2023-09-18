import Question from "@/components/Question";
import prisma from "@/prisma/prisma";
import { notFound } from "next/navigation";

export default function Page({ params }) {
  const { questionId } = params;
  return <Question questionId={questionId} />;
}

export async function generateMetadata({ params }) {
  const { questionId } = params;

  let question;
  try {
    question = await prisma.question.findUniqueOrThrow({
      where: {
        id: questionId,
      },
    });
  } catch (err) {
    notFound();
  }

  return {
    title: question.questionText,
  };
}

// export async function generateStaticParams() {
//   const questions = await prisma.question.findMany();
//   return questions.map((question) => ({
//     questionId: question.id,
//   }));
// }
