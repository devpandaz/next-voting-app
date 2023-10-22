"use client";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { LoadingWebsite } from "@/app/loading";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Feed() {
  const [questions, setQuestions] = useState();
  const lastQuestionId = useRef(null);
  const [hasMore, setHasMore] = useState();

  const router = useRouter();

  const searchParams = useSearchParams();
  const searchQuery = decodeURI(searchParams.get("q")).replace(/ /g, " & "); // searchParams.get("q") returns null if no "q" param is found, and decodeURI(null) returns "null"
  const [searchBoxInput, setSearchBoxInput] = useState(
    searchQuery !== "null" ? searchQuery : "",
  );

  async function fetchQuestions() {
    try {
      const body = {
        lastQuestionId: lastQuestionId.current,
        searchQuery: searchQuery,
      };
      const res = await fetch("/api/questions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => res.json());

      // if got searchQuery just setQuestions to search results
      if (searchQuery !== "null") {
        setQuestions(res.questions);
        return;
      }

      // pagination for polls listing
      lastQuestionId.current = res.lastQuestionId;
      if (hasMore) {
        setQuestions([...questions, ...res.questions]);
      } else {
        setQuestions(res.questions);
      }
      setHasMore(res.hasMore);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (searchQuery === "null") {
      setQuestions();
    }
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  function onSearchSubmit(e) {
    e.preventDefault();
    if (searchBoxInput === "") {
      router.push("/feed");
    } else {
      lastQuestionId.current = null;
      router.push(`/feed?q=${searchBoxInput}`);
    }
  }

  if (!questions) {
    return <LoadingWebsite />;
  }

  return (
    <>
      <div className="my-2">
        <form
          onSubmit={onSearchSubmit}
          className="flex md:absolute md:right-0 mx-auto md:mx-0 w-fit"
        >
          <Input
            type="text"
            className="w-[200px]"
            placeholder="Search poll"
            value={searchBoxInput}
            onChange={(e) => {
              setSearchBoxInput(e.target.value);
            }}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
          >
            <Search className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </form>
        <h1 className="font-bold text-2xl text-center my-2">
          Public Feed
        </h1>
      </div>
      <div className="w-fit mx-auto flex flex-col">
        {questions.length === 0
          ? (searchQuery !== "null"
            ? <p>No poll found.</p>
            : <p>No poll yet.</p>)
          : (
            <>
              <Suspense>
                <div className="max-w-sm md:max-w-md lg:max-w-lg flex flex-col">
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
    </>
  );
}
