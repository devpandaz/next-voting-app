"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { Menu, Pencil, Share, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Comments from "./Comments";
import { useTheme } from "next-themes";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "@/context/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Question({ questionId }) {
  const router = useRouter();

  const [question, setQuestion] = useState();
  const [newChoiceId, setNewChoiceId] = useState();
  const [currentChoiceId, setCurrentChoiceId] = useState();
  const [choicesWithUsersCount, setChoicesWithUsersCount] = useState();
  const [totalVotes, setTotalVotes] = useState();

  const [submitting, setSubmitting] = useState(false);

  const { toast, dismiss } = useToast();
  const currentToastId = useRef();

  const [showComments, setShowComments] = useState(false);

  const { user, loading } = useAuthContext();

  const { theme } = useTheme();

  // dismiss toast when component unmounts so that it does not stay, for example after routing to other pages
  useEffect(() => {
    return () => {
      if (currentToastId.current) {
        dismiss();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentToastId]);

  const form = useForm({});

  async function fetchQuestion() {
    const body = { uid: user?.uid };
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
      fetchQuestion();
    });

    return () => {
      pusher_client.unsubscribe(`${questionId}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pollTitle = useRef();
  const shareButton = useRef();
  const editButton = useRef();
  const deleteButton = useRef();

  const menuForSmScreens = useRef();

  const onScroll = () => {
    if (window.scrollY > 80) {
      shareButton.current?.classList.add("hidden");
      editButton.current?.classList.add("hidden");
      deleteButton.current?.classList.add("hidden");

      if (pollTitle.current !== undefined) {
        pollTitle.current.style.left = "49.4px";
        pollTitle.current.style.textAlign = "center";
      }

      menuForSmScreens.current?.classList.add("hidden");
    } else {
      shareButton.current?.classList.remove("hidden");
      editButton.current?.classList.remove("hidden");
      deleteButton.current?.classList.remove("hidden");

      if (pollTitle.current !== undefined) {
        pollTitle.current.style.left = "0";
        pollTitle.current.style.textAlign = "left";
      }

      menuForSmScreens.current?.classList.remove("hidden");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (loading || !question) {
    return <LoadingWebsite />;
  }

  async function onSubmit() {
    if (!user) {
      router.push(`/auth/signin?redirect=/feed/${questionId}`);
      return;
    }

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
    <div className="w-fit mx-auto flex flex-col mb-2">
      <Card className="my-2 border-2 rounded-xl border-slate-300 w-80 md:w-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center sticky top-0 backdrop-blur-lg">
            <span
              ref={pollTitle}
              className={`w-[225px] md:w-[320px] text-base md:text-2xl ${
                question.questionText.length >= 100 ? "text-sm md:text-lg" : ""
              }`}
              style={{
                position: "relative",
                left: "0",
                transition: "left 500ms ease",
              }}
            >
              {question.questionText}
            </span>

            {/* for middle screens */}
            <div className="hidden grow md:flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    ref={shareButton}
                    variant="ghost"
                    size="icon"
                    className={(user && user.uid === question.user.uid)
                      ? "mr-0.5"
                      : "ml-auto"}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Share</DialogTitle>
                    <DialogDescription>
                      Share this poll to get more people to vote!
                    </DialogDescription>
                  </DialogHeader>
                  <span
                    className="hover:cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied to clipboard",
                        duration: 2000,
                      });
                    }}
                  >
                    {window.location.href}
                  </span>
                </DialogContent>
              </Dialog>

              {(user && user.uid === question.user.uid) &&
                (
                  <>
                    <Button
                      ref={editButton}
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        router.push(
                          `/editpoll?id=${question.id}&back=question`,
                        );
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          ref={deleteButton}
                          variant="ghost"
                          size="icon"
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
                                toast({
                                  title: "Poll delete successfull. ",
                                  duration: 2500,
                                });
                                // this toast should stay even after routing to other pages
                                currentToastId.current = null;
                                router.push("/feed");
                              } catch (err) {
                                const { id } = toast({
                                  variant: "destructive",
                                  title: "Poll delete failed. ",
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
            </div>
            {/* end */}

            {/* for sm screens: phone */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  ref={menuForSmScreens}
                  variant="ghost"
                  className="md:hidden"
                  size="icon"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        ref={shareButton}
                        variant="ghost"
                        size="icon"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Share</DialogTitle>
                        <DialogDescription>
                          Share this poll to get more people to vote!
                        </DialogDescription>
                      </DialogHeader>
                      <span
                        className="hover:cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast({
                            title: "Link copied to clipboard",
                            duration: 2000,
                          });
                        }}
                      >
                        {window.location.href}
                      </span>
                    </DialogContent>
                  </Dialog>

                  {(user && user.uid === question.user.uid) &&
                    (
                      <>
                        <Button
                          ref={editButton}
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            router.push(
                              `/editpoll?id=${question.id}&back=question`,
                            );
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button
                              ref={deleteButton}
                              variant="ghost"
                              size="icon"
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
                                    toast({
                                      title: "Poll delete successfull. ",
                                      duration: 2500,
                                    });
                                    // this toast should stay even after routing to other pages
                                    currentToastId.current = null;
                                    router.push("/feed");
                                  } catch (err) {
                                    const { id } = toast({
                                      variant: "destructive",
                                      title: "Poll delete failed. ",
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
                </>
              </PopoverContent>
            </Popover>
            {/* end */}
          </CardTitle>
          <CardDescription>
            Posted by{" "}
            <Link
              href={`/profile/${
                user?.uid === question.user.uid ? "" : question.user.uid
              }`} // go to own profile if its own question, else go to public profile of the author
              className="underline text-yellow-500 dark:text-red-300"
            >
              {user?.uid === question.user.uid
                ? "you"
                : question.user.displayName}
            </Link>{" "}
            on {new Date(question.timePublished).toLocaleDateString()}
            {question.imageURL &&
              (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={question.imageURL}
                  alt="poll image"
                  className="mt-2 mx-auto"
                />
              )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {question.choices.length > 0
            ? (
              <QuestionContextMenu
                uid={user?.uid}
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
                          <FormItem className="space-y-3">
                            {/*<FormLabel>{question.questionText}</FormLabel>*/}
                            <FormControl>
                              <RadioGroup
                                onValueChange={(e) => {
                                  setNewChoiceId(e); // e is the value of the selected choice, aka the id of the choice
                                }}
                                defaultValue={currentChoiceId}
                                className="flex flex-col space-y-1"
                              >
                                {question.choices.map((choice) => (
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
                                              value={currentChoiceId
                                                ? parseInt( // voted dy then only can see results
                                                  choicesWithUsersCount.filter(
                                                    (stats) =>
                                                      stats.id === choice.id,
                                                  )[0]
                                                    ._count
                                                    .users,
                                                ) / totalVotes * 100
                                                : 0}
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
                                newChoiceId !== currentChoiceId) || submitting}
                            >
                              {submitting &&
                                (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}

                              Resubmit
                            </Button>
                          )
                          : (
                            <Button
                              type="submit"
                              disabled={!newChoiceId || submitting}
                            >
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

      {
        /*
      <div className="flex justify-center mt-4">
        <Button asChild variant="outline">
          <Link href="/feed">
            <Home className="mr-2 h-4 w-4" />Back to home
          </Link>
        </Button>
      </div>
      */
      }
      {!showComments &&
        (
          <Button
            className="self-center mt-2"
            onClick={() => {
              setShowComments(true);
            }}
          >
            Open comments
          </Button>
        )}
      {showComments &&
        <Comments theme={theme} key={uuidv4()} />}
    </div>
  );
}
