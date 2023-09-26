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
        <ul className="list-disc max-h-[40vh] overflow-auto">
          {questions.map((question) => (
            <li key={question.id} className="flex items-center">
              <Link
                href={`/feed/${question.id}`}
                className="grow hover:underline hover:text-yellow-500 dark:hover:text-red-300"
              >
                <span>
                  {question.questionText}
                </span>
              </Link>
              {user.uid == uid &&
                (
                  <>
                    <Button
                      disabled={deletingPoll}
                      className="mr-0.5"
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
                              const body = {
                                questionId: question.id,
                              };
                              try {
                                await fetch("/api/delete-poll/", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(body),
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
      <ul className="list-disc">
        {votes.map((vote) => (
          <li key={vote.id}>
            <Link
              href={`/feed/${vote.question.id}`}
              className="text-sm hover:underline hover:text-yellow-500 dark:hover:text-red-300"
            >
              &quot;{vote.choiceText}&quot; in &quot;{vote.question
                .questionText}&quot;
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
