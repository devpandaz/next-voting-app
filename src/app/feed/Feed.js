"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;

export default function Feed() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [questions, setQuestions] = useState();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [loading, user]);

  async function fetchQuestions() {
    const res = await fetch(`${WEBSITE_BASE_URL}/api/questions/`);
    const data = await res.json();
    setQuestions(data.questions);
  }

  useEffect(() => {
    if (!loading) {
      fetchQuestions();
    }
  }, [loading]);

  if (loading) {
    return <LoadingWebsite />;
  }

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
                href={`/feed/question/${question.id}`}
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
