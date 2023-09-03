"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "@/app/loading";

const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;

export default function Feed() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [questions, setQuestions] = useState();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  async function fetchQuestions() {
    try {
      const res = await fetch(`${WEBSITE_BASE_URL}/api/questions/`);
      const data = await res.json();
      setQuestions(data.questions);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading || !user) {
    return <LoadingWebsite />;
  }

  return (
    <div className="w-fit mx-auto">
      <h1 className="text-center text-xl">
        Welcome back, {user.displayName}
      </h1>
      <h1 className="text-center text-xl">Public Feed</h1>
      <Suspense fallback=<h1>Loading...</h1>>
        <div className="mx-10 max-w-md">
          {questions &&
            questions.map((question) => (
              <Link
                key={question.id}
                href={`/feed/${question.id}`}
                className="p-5 my-5 border-2 border-sky-500 rounded-lg text-center block hover:border-red-500"
              >
                {question.questionText}
              </Link>
            ))}
        </div>
      </Suspense>
    </div>
  );
}
