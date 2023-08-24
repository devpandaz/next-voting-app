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

const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;

export default function Question({ questionId }) {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [question, setQuestion] = useState();
  const { toast } = useToast();
  const form = useForm({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [loading, user]);

  async function fetchQuestion() {
    const res = await fetch(`${WEBSITE_BASE_URL}/api/questions/${questionId}`);
    const data = await res.json();
    setQuestion(data.question);
  }

  useEffect(() => {
    if (!loading) {
      fetchQuestion();
    }
  }, [loading]);

  if (loading || !question) {
    return <LoadingWebsite />;
  }

  async function onSubmit(data) {
    if (data.choice !== undefined) {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      try {
        const body = { selected: data.choice };
        const res = await fetch(`${WEBSITE_BASE_URL}/api/vote/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).then((res) => res.json());
        setQuestion(res.question.question);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="w-fit mx-auto">
      <h1>{question.questionText}</h1>
      {question.choices.length > 0
        ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="choice"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{question.questionText}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {question.choices.map((choice) => (
                          <FormItem
                            key={choice.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={choice.id} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {choice.choiceText}
                            </FormLabel>
                            <FormLabel className="font-normal">
                              {choice.votes}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        )
        : <h3>No choices are available for this poll question.</h3>}
      <Link href="/feed">Back to home</Link>
    </div>
  );
}
