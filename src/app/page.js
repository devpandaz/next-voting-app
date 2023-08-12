import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

const path = require("path");

require("dotenv").config({
  path: path.normalize(__dirname + "/../../.env"),
});

const API_BASE_URL = process.env.API_BASE_URL;

export default async function Home() {
  const questions = await fetch(
    `${API_BASE_URL}/questions/`,
  ).then((res) => res.json());

  const user = await currentUser();
  console.log(user);

  return (
    <div className="w-fit mx-auto">
      <h1 className="text-center text-xl">
        Welcome back, {user.firstName ? user.firstName : user.username}.
      </h1>
      <h1 className="text-center text-xl">Feed</h1>
      <Suspense fallback=<h1>Loading...</h1>>
        <div className="mx-10 max-w-md">
          {questions &&
            questions.map((question) => (
              <Link
                href={`/question/${question.id}`}
                className="px-5 py-5 my-5 border-2 border-sky-500 rounded-lg text-center block hover:border-red-500"
              >
                {question.question_text}
              </Link>
            ))}
        </div>
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Your feed",
};
