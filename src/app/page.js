import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import prisma from "../../prisma/prisma";

const path = require("path");

require("dotenv").config({
  path: path.normalize(__dirname + "/../../.env"),
});

export default async function Home() {
  const questions = await prisma.question.findMany();

  // const user = await currentUser();
  // console.log(user);

  return (
    <div className="w-fit mx-auto">
      <h1 className="text-center text-xl">
        {/*Welcome back, {user.firstName ? user.firstName : user.username}.*/}
      </h1>
      <h1 className="text-center text-xl">Public Feed</h1>
      <Suspense fallback=<h1>Loading...</h1>>
        <div className="mx-10 max-w-md">
          {questions &&
            questions.map((question) => (
              <Link
                key={question.id}
                href={`/question/${question.id}`}
                className="px-5 py-5 my-5 border-2 border-sky-500 rounded-lg text-center block hover:border-red-500"
              >
                {question.questionText}
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
