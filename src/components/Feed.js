"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "@/app/loading";
import { Button } from "./ui/button";

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
      <h1 className="font-bold text-center text-2xl mb-2">Public Feed</h1>
      <Suspense>
        <div className="mx-10 max-w-md flex flex-col space-between-1">
          {questions &&
            questions.map((question) => (
              <Link
                href={`/feed/${question.id}`}
                className="flex"
                key={question.id}
              >
                <Button
                  variant="link"
                  className="hover:text-yellow-500 dark:hover:text-red-300 grow"
                >
                  {question.questionText}
                </Button>
              </Link>
            ))}
        </div>
      </Suspense>
    </div>
  );
}
