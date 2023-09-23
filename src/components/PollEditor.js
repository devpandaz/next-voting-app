"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "@/app/loading";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "./ui/toast";
import Link from "next/link";

export default function PollEditor({ toBeEditedQuestionId = null }) {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [pollTitle, setPollTitle] = useState();
  const [choiceText, setChoiceText] = useState();
  const [choices, setChoices] = useState([]);

  const [submitting, setSubmitting] = useState();

  const lastChoice = useRef();
  const choiceInputBox = useRef();

  const { toast, dismiss } = useToast();
  const currentToastId = useRef();

  useEffect(() => {
    if (lastChoice.current) {
      lastChoice.current.scrollIntoView();
      choiceInputBox.current.focus();
    }
  }, [lastChoice, choiceInputBox]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  // dismiss toast when component unmounts so that it does not stay, for example after routing to other pages
  useEffect(() => {
    return () => {
      if (currentToastId.current) {
        dismiss(currentToastId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentToastId]);

  // check if got toBeEditedQuestionId prop, means editing existing poll
  useEffect(() => {
    if (toBeEditedQuestionId) {
      async function fetchExistingQuestion(id) {
        const body = { uid: user.uid };
        const res = await fetch(`/api/questions/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).then((res) => res.json());
        let existingQuestion = res.question;
        setPollTitle(existingQuestion.questionText);
        setChoices(existingQuestion.choices.map((choice) => choice.choiceText));
      }
      fetchExistingQuestion(toBeEditedQuestionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toBeEditedQuestionId]);

  if (loading) {
    return <LoadingWebsite />;
  }

  function addChoice(e) {
    e.preventDefault();
    if (choiceText && !choices.includes(choiceText)) {
      setChoices([...choices, choiceText]);
      setChoiceText("");
    }
  }

  function removeChoice(indexToBeRemoved) {
    setChoices(choices.filter((choice, index) => {
      return index != indexToBeRemoved;
    }));
  }

  async function createOrUpdatePoll() {
    if (!pollTitle) {
      toast({
        variant: "destructive",
        title: "Fill in poll title. ",
      });
    } else if (choices.length <= 1) {
      toast({
        variant: "destructive",
        title: "Your poll must have at least 2 choices. ",
      });
    } else {
      try {
        const body = {
          uid: user.uid,
          questionText: pollTitle,
          choices: choices,
          toBeEditedQuestionId: toBeEditedQuestionId,
        };
        setSubmitting(true);
        const res = await fetch("/api/create-or-update-poll/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).then((res) => res.json());
        if (toBeEditedQuestionId) {
          toast({
            title: "Poll edited successfully. ",
            duration: 2000,
          });
          router.push(`feed/${toBeEditedQuestionId}`);
        } else {
          setSubmitting(false);
          const { id } = toast({
            title: "Poll created successfully. ",
            action: (
              <ToastAction altText="Visit poll">
                <button
                  onClick={() => {
                    router.push(`/feed/${res.createdOrEditedQuestionId}`);
                  }}
                >
                  Visit poll
                </button>
              </ToastAction>
            ),
          });
          currentToastId.current = id;

          // clear form
          setPollTitle("");
          setChoiceText("");
          setChoices([]);
        }
      } catch (err) {
        console.log(err);
        toast({
          title: `${toBeEditedQuestionId ? "Edit" : "Create"} poll failed`,
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="w-fit mx-auto">
      <h1 className="text-xl text-center my-3">Create new poll</h1>
      <div className="flex flex-col border-2 border-slate-950 dark:border-slate-50 rounded-lg px-8 py-4 w-80">
        <Label className="text-lg mb-1 self-center">
          Poll title
        </Label>
        <Input
          type="text"
          id="pollTitle"
          value={pollTitle}
          className="grow mb-2"
          placeholder="e.g. How to pronounce GIF?"
          onChange={(e) => {
            setPollTitle(e.target.value);
          }}
        />
        <form onSubmit={addChoice}>
          <div className="flex flex-col mb-4">
            <Label htmlFor="choice" className="text-lg mb-1 self-center">
              Choices
            </Label>
            <div className="flex">
              <Input
                type="text"
                id="choice"
                value={choiceText}
                disabled={choices.length >= 10}
                className="mr-2 w-[12.8rem]"
                placeholder="e.g. JIF"
                onChange={(e) => {
                  setChoiceText(e.target.value);
                }}
                ref={choiceInputBox}
              >
              </Input>
              <div className="flex grow justify-end">
                <Button
                  type="submit"
                  disabled={choices.length == 10}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
        <div id="choices" className="max-h-80 overflow-auto space-y-1 mb-2">
          {choices.length == 0
            ? (
              <p className="text-sm text-center">
                You haven&apos;t added any choices yet.
              </p>
            )
            : choices.map((choice, index) => (
              <div
                key={index}
                className="flex border-2 border-yellow-500 dark:border-red-300 rounded-lg"
                ref={index == choices.length - 1 ? lastChoice : null}
              >
                <span className="break-words w-52 mr-2 self-center pl-2">
                  {choice}
                </span>
                <Button
                  variant="ghost"
                  className="self-center"
                  size="icon"
                  onClick={() => {
                    removeChoice(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </div>

        {toBeEditedQuestionId
          ? (
            <>
              <Button
                disabled={submitting}
                onClick={createOrUpdatePoll}
                className="self-center mt-2"
              >
                {submitting &&
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save poll
              </Button>
              <Link
                className="hover:underline text-sm self-center mt-1 hover:text-yellow-500 dark:hover:text-red-300"
                href={`/feed/${toBeEditedQuestionId}`}
              >
                Cancel
              </Link>
            </>
          )
          : (
            <Button
              disabled={submitting}
              onClick={createOrUpdatePoll}
              className="self-center mt-2"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create poll
            </Button>
          )}
      </div>
    </div>
  );
}
