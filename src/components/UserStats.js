"use client";
import { AlertCircle, Check, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export function UserPolls({ uid }) {
  const [questions, setQuestions] = useState();
  const [deletingPoll, setDeletingPoll] = useState(null);
  const successAlertBox = useRef();
  const failAlertBox = useRef();
  const deletedPollTitle = useRef();
  const router = useRouter();
  const { user } = useAuthContext();

  async function fetchPolls() {
    try {
      const body = {
        uid: uid,
      };
      const res = await fetch("/api/userpolls/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => res.json());
      setQuestions(res.questions);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!questions) {
    // data not loaded yet
    return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  }

  const alertBoxes = (
    <>
      <Alert ref={successAlertBox} className="hidden mb-1">
        <Check className="h-4 w-4" />
        <AlertTitle>
          Poll &quot;{deletedPollTitle.current}&quot; deleted successfully.
        </AlertTitle>
      </Alert>
      <Alert ref={failAlertBox} variant="destructive" className="hidden mb-1">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Poll delete failed.</AlertTitle>
      </Alert>
    </>
  );

  // data loaded already
  if (questions.length !== 0) {
    return (
      <>
        {alertBoxes}
        <ul className="list-disc max-h-[40vh] overflow-auto space-y-1.5">
          {questions.map((question) => (
            <li
              key={question.id}
              className="flex items-center border-2 border-black dark:border-white rounded-lg"
            >
              <Link
                href={`/feed/${question.id}`}
                className="ml-2 min-h-[40px] w-[125px] text-sm md:text-base md:w-[300px] hover:text-yellow-500 dark:hover:text-red-300 block flex items-center"
              >
                <span>
                  {question.questionText}
                </span>
              </Link>
              {(user && user.uid == uid) &&
                (
                  <>
                    <Button
                      disabled={deletingPoll}
                      className="ml-auto mr-0.5"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        router.push(`/editpoll?id=${question.id}&back=profile`);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          disabled={deletingPoll}
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                          }}
                        >
                          {deletingPoll === question.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this poll?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={async () => {
                              setDeletingPoll(question.id);
                              try {
                                if (question.imageURL) {
                                  // delete image file from vercel blob store
                                  await fetch("/api/image/delete", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      url: question.imageURL,
                                    }),
                                  });
                                }

                                await fetch("/api/delete-poll/", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    questionId: question.id,
                                  }),
                                });

                                deletedPollTitle.current =
                                  question.questionText;
                                successAlertBox.current.classList.remove(
                                  "hidden",
                                );
                                fetchPolls();
                              } catch (err) {
                                failAlertBox.current.classList.remove("hidden");
                              } finally {
                                setDeletingPoll(null);
                              }
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    return (
      <>
        {alertBoxes}
        <p>
          You don&apos;t have any polls yet.{" "}
          <Link
            href="/newpoll"
            className="underline text-yellow-500 dark:text-red-300"
          >
            Create one now!
          </Link>
        </p>
      </>
    );
  }
}

export function UserVotes({ uid }) {
  const [votes, setVotes] = useState();

  async function fetchVotes() {
    try {
      const body = {
        uid: uid,
      };
      const res = await fetch("/api/uservotes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => res.json());
      setVotes(res.votes);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchVotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!votes) {
    // data not loaded yet
    return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  }

  // data loaded already
  if (votes.length !== 0) {
    return (
      <ul className="list-disc max-h-[40vh] overflow-auto space-y-1.5">
        {votes.map((vote) => (
          <li
            key={vote.id}
            className="border-2 border-black dark:border-white rounded-lg"
          >
            <Link
              href={`/feed/${vote.question.id}`}
              className="block mx-2 min-h-[40px] md:w-[350px] hover:text-yellow-500 dark:hover:text-red-300 flex"
            >
              <span className="self-center">
                &quot;{vote.choiceText}&quot;{" "}
                <span className="text-lime-500 dark:text-red-500 font-bold">
                  in
                </span>{" "}
                &quot;{vote.question
                  .questionText}&quot;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <>
        You haven&apos;t voted in any poll yet.{" "}
        <Link
          href="/feed"
          className="underline text-yellow-500 dark:text-red-300"
        >
          Vote in one now!
        </Link>
      </>
    );
  }
}
