import Link from "next/link";
import prisma from "../../../../prisma/prisma";

const path = require("path");

require("dotenv").config({
  path: path.normalize(__dirname + "/../../.env"),
});

export default async function Page({ params }) {
  const { questionId } = params;

  const question = await prisma.question.findUniqueOrThrow({
    where: {
      id: parseInt(questionId),
    },
    include: {
      choices: true,
    },
  });

  return (
    <div className="w-fit mx-auto">
      <h1>{question.questionText}</h1>
      <form>
        {question.choices.length > 0
          ? question.choices.map((choice, index) => (
            <>
              <input
                type="radio"
                name="choice"
                id={`choice${index}`}
                value={"placeholder"}
              />
              <label htmlFor={`choice${index}`}>{choice.choiceText}</label>
              <br />
            </>
          ))
          : <h3>No choices are available for this poll question.</h3>}
      </form>
      <Link href="/">Back to home</Link>
    </div>
  );
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
