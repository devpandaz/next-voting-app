"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "@/app/loading";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Home, Pencil, Trash2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { pusher_client } from "@/lib/pusher_client";
import QuestionContextMenu from "./QuestionContextMenu";
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
import { Loader2 } from "lucide-react";

export default function Question({ questionId }) {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [question, setQuestion] = useState();
  const [newChoiceId, setNewChoiceId] = useState();
  const [currentChoiceId, setCurrentChoiceId] = useState();
  const [choicesWithUsersCount, setChoicesWithUsersCount] = useState();
  const [totalVotes, setTotalVotes] = useState();

  const [submitting, setSubmitting] = useState(false);

  const { toast, dismiss } = useToast();
  const currentToastId = useRef();

  // dismiss current toast when component unmounts so that it does not stay, for example after routing to other pages
  useEffect(() => {
    return () => {
      dismiss(currentToastId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentToastId]);

  const form = useForm({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  async function fetchQuestion() {
    const body = { uid: user.uid };
    const res = await fetch(`/api/questions/${questionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json());
    setQuestion(res.question);
    setCurrentChoiceId(res.currentChoiceId);
    setChoicesWithUsersCount(res.choicesWithUsersCount);
    setTotalVotes(res.totalVotes);
  }

  useEffect(() => {
    if (!loading) {
      fetchQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    const channel = pusher_client.subscribe(`${questionId}`);

    channel.bind("update-stats", (data) => {
      console.log("data: " + data);
      fetchQuestion();
    });

    return () => {
      pusher_client.unsubscribe(`${questionId}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !user || !question) {
    return <LoadingWebsite />;
  }

  async function onSubmit() {
    if (newChoiceId !== currentChoiceId) {
      setSubmitting(true);
      try {
        const body = {
          uid: user.uid,
          questionId: questionId,
          currentChoiceId: currentChoiceId,
          newChoiceId: newChoiceId,
        };
        await fetch("/api/vote/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setSubmitting(false);
        const { id } = toast({
          title: "Your choice is recorded. ",
        });
        currentToastId.current = id;
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="w-fit mx-auto">
      <Card className="my-2 border-2 rounded-xl border-slate-300 w-80">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="break-words grow">{question.questionText}</span>
            {user.uid === question.user.uid &&
              (
                <>
                  <Button
                    className="mr-0.5"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      router.push(`/editpoll?id=${question.id}`);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
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
                            const body = {
                              questionId: question.id,
                            };
                            try {
                              await fetch("/api/delete-poll/", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body),
                              });
                              toast({
                                title: "Poll deleted successfully. ",
                                duration: 2500,
                              });
                              router.push("/feed");
                            } catch (err) {
                              const { id } = toast({
                                variant: "destructive",
                                title: "Poll delete failed",
                              });
                              currentToastId.current = id;
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
          </CardTitle>
          <CardDescription>
            Posted by{" "}
            <Link
              href={`/profile/${
                user.uid === question.user.uid ? "" : question.user.uid
              }`} // go to own profile if its own question, else go to public profile of the author
              className="underline text-yellow-500 dark:text-red-300"
            >
              {user.uid === question.user.uid
                ? "you"
                : question.user.displayName}
            </Link>{" "}
            on {new Date(question.datePublished).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {question.choices.length > 0
            ? (
              <QuestionContextMenu
                uid={user.uid}
                questionId={questionId}
                currentChoiceId={currentChoiceId}
                submitting={submitting}
                setSubmitting={setSubmitting}
              >
                <Form {...form}>
                  <div className="flex flex-col items-center">
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="choice"
                        render={({ field }) => (
                          <FormItem className="space-y-3 max-h-96 overflow-auto">
                            {/*<FormLabel>{question.questionText}</FormLabel>*/}
                            <FormControl>
                              <RadioGroup
                                onValueChange={(e) => {
                                  setNewChoiceId(e); // e is the value of the selected choice, aka the id of the choice
                                }}
                                defaultValue={currentChoiceId}
                                className="flex flex-col space-y-1"
                              >
                                {question.choices.map((choice, index) => (
                                  <FormItem
                                    key={choice.id}
                                  >
                                    <div className="flex flex-col">
                                      <div className="flex items-center pb-2">
                                        <FormControl>
                                          <RadioGroupItem
                                            value={choice.id}
                                          />
                                        </FormControl>
                                        <div className="pl-2 w-52 mr-2">
                                          <FormLabel className="font-normal break-words">
                                            {choice.choiceText}
                                            <Progress
                                              value={parseInt(
                                                choicesWithUsersCount[index]
                                                  ._count
                                                  .users,
                                              ) / totalVotes * 100}
                                            />
                                          </FormLabel>
                                        </div>
                                      </div>
                                    </div>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-center">
                        {currentChoiceId
                          ? (
                            <Button
                              type="submit"
                              disabled={!(newChoiceId &&
                                newChoiceId !== currentChoiceId)}
                            >
                              {submitting &&
                                (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}

                              Resubmit
                            </Button>
                          )
                          : (
                            <Button type="submit" disabled={!newChoiceId}>
                              {submitting &&
                                (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}

                              Submit
                            </Button>
                          )}
                      </div>
                    </form>
                  </div>
                </Form>
              </QuestionContextMenu>
            )
            : <h3>No choices are available for this poll question.</h3>}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-4">
        <Button asChild variant="outline">
          <Link href="/feed">
            <Home className="mr-2 h-4 w-4" />Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
