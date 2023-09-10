"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Home } from "lucide-react";
import { Progress } from "./ui/progress";
import { pusher_client } from "@/lib/pusher_client";
import QuestionContextMenu from "./QuestionContextMenu";

export default function Question({ questionId }) {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [question, setQuestion] = useState();
  const [newChoiceId, setNewChoiceId] = useState();
  const [currentChoiceId, setCurrentChoiceId] = useState();
  const [choicesWithUsersCount, setChoicesWithUsersCount] = useState();
  const [totalVotes, setTotalVotes] = useState();

  const { toast } = useToast();
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
    setCurrentChoiceId(parseInt(res.currentChoiceId));
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
    // check production
    console.log("is this useEffect even working?");
    const channel = pusher_client.subscribe(`${questionId}`);

    channel.bind("update stats", (data) => {
      console.log(data);
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
      toast({
        title: "Your choice is recorded. ",
      });
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

        // // update locally first, the interval above will update the stats every 1 minute
        // setChoicesWithUsersCount(choicesWithUsersCount.map((choice) => {
        //   if (choice.id == newChoiceId) {
        //     return {
        //       ...choice,
        //       _count: { users: parseInt(choice._count.users) + 1 },
        //     };
        //   } else {
        //     return choice;
        //   }
        //
        // }));
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="w-fit mx-auto">
      <Card className="my-2 border-2 rounded-xl border-slate-300 mx-4 w-80">
        <CardHeader>
          <CardTitle className="break-words">{question.questionText}</CardTitle>
        </CardHeader>
        <CardContent>
          {question.choices.length > 0
            ? (
              <QuestionContextMenu
                uid={user.uid}
                questionId={questionId}
                currentChoiceId={currentChoiceId}
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
                                  setNewChoiceId(e); // e is the value of the selected choice
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
                              Resubmit
                            </Button>
                          )
                          : (
                            <Button type="submit" disabled={!newChoiceId}>
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
