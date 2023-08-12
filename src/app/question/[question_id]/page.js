import Link from "next/link";

const path = require("path");

require("dotenv").config({
  path: path.normalize(__dirname + "/../../.env"),
});

const API_BASE_URL = process.env.API_BASE_URL;

export default async function Page({ params }) {
  const { question_id } = params;

  const question = await fetch(
    `${API_BASE_URL}/questions/${question_id}`,
  ).then((res) => res.json());

  return (
    <div className="w-fit mx-auto">
      <h1>{question.question_text}</h1>
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
              <label htmlFor={`choice${index}`}>{choice}</label>
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
  const { question_id } = params;

  const question = await fetch(
    `${API_BASE_URL}/questions/${question_id}`,
  ).then((res) => res.json());

  return {
    title: question.question_text,
  };
}

export async function generateStaticParams() {
  const questions = await fetch(
    `${API_BASE_URL}/questions/`,
  ).then((res) => res.json());

  return questions.map((question) => ({
    question_id: question.id.toString(),
  }));
}
