"use client";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { LoadingWebsite } from "@/app/loading";
import { Button } from "./ui/button";

export default function Feed() {
  const [questions, setQuestions] = useState();
  const lastQuestionId = useRef(null);
  const [hasMore, setHasMore] = useState();

  async function fetchQuestions() {
    try {
      const body = { lastQuestionId: lastQuestionId.current };
      const res = await fetch("/api/questions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => res.json());
      lastQuestionId.current = res.lastQuestionId;
      setHasMore(res.hasMore);
      if (questions) { // already fetched questions before
        setQuestions([...questions, ...res.questions]);
      } else { // first time fetch, since state initial value is null "useState()"
        setQuestions(res.questions);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!questions) {
    return <LoadingWebsite />;
  }

  return (
    <div className="w-fit mx-auto flex flex-col">
      <h1 className="font-bold text-center text-2xl my-2">Public Feed</h1>

      {questions.length === 0 ? <p>No poll yet.</p> : (
        <>
          <Suspense>
            <div className="max-w-md flex flex-col space-between-1">
              {questions &&
                questions.map((question) => (
                  <Link
                    href={`/feed/${question.id}`}
                    className="flex"
                    key={question.id}
                  >
                    <Button
                      variant="link"
                      className="text-left hover:text-yellow-500 dark:hover:text-red-300 grow h-fit"
                    >
                      {question.questionText}
                    </Button>
                  </Link>
                ))}
            </div>
          </Suspense>
          {hasMore &&
            (
              <Button className="self-center" onClick={fetchQuestions}>
                Load more
              </Button>
            )}
        </>
      )}
    </div>
  );
}
