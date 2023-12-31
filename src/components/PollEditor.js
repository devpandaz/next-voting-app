"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoadingWebsite } from "@/app/loading";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ImageUploader from "./ImageUploader";
import { v4 as uuidv4 } from "uuid";
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
import useAuthorize from "./useAuthorize";

export default function PollEditor({ toBeEditedQuestionId = null, back }) {
  const router = useRouter();

  const [pollTitle, setPollTitle] = useState();
  const [choiceText, setChoiceText] = useState();
  const [choices, setChoices] = useState([]);
  const [removedExistingChoicesIDs, setRemovedExistingChoicesIDs] = useState(
    [],
  );
  const [file, setFile] = useState();
  const existingImageURL = useRef();

  const [submitting, setSubmitting] = useState();

  const [indexOfChoiceBeingEdited, setIndexOfChoiceBeingEdited] = useState();

  // const [lastChoice, setLastChoice] = useState();
  const choiceInputBox = useRef();

  const { toast, dismiss } = useToast();
  // const currentToastId = useRef();

  const { user, loading } = useAuthorize();

  const pathname = usePathname();

  const [fetching, setFetching] = useState(true);

  // useEffect(() => {
  //   lastChoice.current?.scrollIntoView();
  //   choiceInputBox.current?.focus();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lastChoice.current]);

  // dismiss toast when component unmounts so that it does not stay, for example after routing to other pages
  // useEffect(() => {
  //   return () => {
  //     if (currentToastId.current) {
  //       dismiss();
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentToastId]);

  useEffect(() => {
    if (user) {
      if (pathname === "/newpoll") {
        setFetching(false);
      } else if (pathname === "/editpoll") {
        if (toBeEditedQuestionId && ["question", "profile"].includes(back)) {
          async function fetchExistingQuestion(id) {
            const body = { uid: user.uid };

            let existingQuestion;

            try {
              const res = await fetch(`/api/questions/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              }).then((res) => res.json());
              existingQuestion = res.question;
            } catch (err) { // invalid toBeEditedQuestionId
              router.replace("/");
            }

            setPollTitle(existingQuestion.questionText);
            if (existingQuestion.imageURL !== "") {
              setFile({ preview: existingQuestion.imageURL });
            }
            existingImageURL.current = existingQuestion.imageURL;
            setChoices(existingQuestion.choices);
          }
          fetchExistingQuestion(toBeEditedQuestionId);
          setFetching(false);
        } else { // editpoll url wrong: no toBeEditedQuestionId or no back query
          router.replace("/");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, toBeEditedQuestionId, back]);

  // useEffect(() => {
  //   const beforeunload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };
  //   window.addEventListener("beforeunload", beforeunload);
  //
  //   return () => {
  //     window.removeEventListener("beforeunload", beforeunload);
  //   };
  // });

  function addChoice(e) {
    e.preventDefault();
    if (
      choiceText && !choices.some((choice) => choice.choiceText === choiceText)
    ) {
      setChoices([...choices, { choiceText: choiceText }]);
      setChoiceText("");
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  function removeChoice(indexToBeRemoved) {
    setChoices(choices.filter((choice, index) => {
      if (index === indexToBeRemoved) {
        if (choice.id) {
          setRemovedExistingChoicesIDs([
            ...removedExistingChoicesIDs,
            choice.id,
          ]);
        }
        return false;
      }
      return true;
    }));
  }

  function editChoiceText(index, newText) {
    choices[index].choiceText = newText;
  }

  const choiceInputOnBlur = (e, originalChoiceText, index) => {
    if (e.target.value === "") {
      e.target.value = originalChoiceText;
    } else {
      editChoiceText(index, e.target.value);
    }
    setIndexOfChoiceBeingEdited();
  };

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
        setSubmitting(true);

        const questionId = toBeEditedQuestionId
          ? toBeEditedQuestionId
          : uuidv4();

        let pollImageURL;

        if (toBeEditedQuestionId) { // if editing poll
          if (!file) { // no image
            if (existingImageURL.current) { // means image removed
              // delete
              await fetch("/api/image/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: existingImageURL.current }),
              });
            }
            pollImageURL = "";
          } else {
            if (file.name) { // file.name is present, means new image is uploaded (image edited), bcos existing one is only {preview: [url]}, see fetchExistingQuestion(), whereas newly uploaded one is {[File object], preview:___}
              // first delete previous image, if any
              if (existingImageURL.current) {
                await fetch("/api/image/delete", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url: existingImageURL.current }),
                });
              }

              // then upload the new one
              const pollImage = await fetch(
                `/api/image/upload?questionId=${questionId}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: file,
                },
              ).then((res) => res.json());
              pollImageURL = pollImage.url;
            } else { // existing image is maintained, not edited
              pollImageURL = existingImageURL.current;
            }
          }
        } else { // creating poll
          // image is optional
          if (file) { // got image uploaded
            // upload it
            const pollImage = await fetch(
              `/api/image/upload?questionId=${questionId}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: file,
              },
            ).then((res) => res.json());
            pollImageURL = pollImage.url;
          } else { // no image uploaded
            pollImageURL = "";
          }
        }

        const body = {
          uid: user.uid,
          questionId: questionId,
          questionText: pollTitle,
          pollImageURL: pollImageURL,
          choices: choices,
          removedExistingChoicesIDs: removedExistingChoicesIDs,
          editing: Boolean(toBeEditedQuestionId),
        };

        fetch("/api/create-or-update-poll/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        toast({
          title: `Poll ${
            toBeEditedQuestionId ? "edited" : "created"
          } successfully. `,
          duration: 2000,
        });
        if (toBeEditedQuestionId) {
          router.replace(`feed/${questionId}`);
        } else {
          router.push(`feed/${questionId}`);
        }

        // -------
        // this block of comment is for "staying at create poll page after created a new poll"
        // setSubmitting(false);
        // toast({
        //   title: "Poll created successfully. ",
        //   action: (
        //     <ToastAction altText="Visit poll">
        //       <button
        //         onClick={() => {
        //           router.push(`/feed/${questionId}`);
        //         }}
        //       >
        //         Visit poll
        //       </button>
        //     </ToastAction>
        //   ),
        // });

        // clear form
        // setPollTitle("");
        // setChoiceText("");
        // setChoices([]);
        // -------
      } catch (err) {
        console.log(err);
        toast({
          title: `${toBeEditedQuestionId ? "Edit" : "Create"} poll failed`,
          variant: "destructive",
        });
      }
    }
  }

  // choices drag and drop
  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setChoices(reorder(
      choices,
      result.source.index,
      result.destination.index,
    ));
  }

  if (loading || !user || fetching) {
    return <LoadingWebsite />;
  }

  return (
    <div className="w-fit mx-auto mb-2">
      <h1 className="text-xl text-center my-3">
        {toBeEditedQuestionId ? "Edit" : "Create new"} poll
      </h1>
      <div className="flex flex-col border-2 border-slate-950 dark:border-slate-50 rounded-lg px-8 py-4 w-80 md:w-[500px]">
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

        <Label className="text-lg mb-1 self-center">
          Poll image (optional)
        </Label>
        <ImageUploader file={file} setFile={setFile} />
        <form onSubmit={addChoice}>
          <div className="flex flex-col mb-4">
            <Label htmlFor="choice" className="text-lg my-1 self-center">
              Choices
            </Label>
            <div className="flex">
              <Input
                type="text"
                id="choice"
                value={choiceText}
                disabled={choices.length >= 10}
                className="mr-2 w-[400px]"
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
        <div id="choices" className="space-y-1 mb-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div
                  ref={droppableProvided.innerRef}
                >
                  {choices.length == 0
                    ? (
                      <p className="text-sm text-center">
                        You haven&apos;t added any choices yet.
                      </p>
                    )
                    : choices.map((choice, index) => (
                      <Draggable
                        key={choice.choiceText}
                        draggableId={choice.choiceText}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                          >
                            <div
                              key={index}
                              className="flex border-2 border-yellow-300 dark:border-red-300 rounded-lg"
                            >
                              {indexOfChoiceBeingEdited !== index &&
                                (
                                  <span
                                    className="break-words w-[400px] mr-2 self-center pl-2"
                                    onClick={() => {
                                      setIndexOfChoiceBeingEdited(index);
                                    }}
                                  >
                                    {choice.choiceText}
                                  </span>
                                )}
                              {indexOfChoiceBeingEdited === index &&
                                (
                                  <Input
                                    autoFocus
                                    type="text"
                                    defaultValue={choice.choiceText}
                                    className="focus-visible:ring-offset-0"
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        choiceInputOnBlur(
                                          e,
                                          choice.choiceText,
                                          index,
                                        );
                                      }
                                    }}
                                    onBlur={(e) => {
                                      choiceInputOnBlur(
                                        e,
                                        choice.choiceText,
                                        index,
                                      );
                                    }}
                                  />
                                )}
                              {toBeEditedQuestionId
                                ? (choice.id
                                  ? (
                                    <AlertDialog>
                                      <AlertDialogTrigger>
                                        <Button
                                          variant="ghost"
                                          className="self-center"
                                          size="icon"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Are you sure you want to delete this
                                            choice?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This is an existing choice. If you
                                            delete this choice, the vote count
                                            for this choice would all be lost.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={() => removeChoice(index)}
                                          >
                                            Yes
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )
                                  : (
                                    <Button
                                      variant="ghost"
                                      className="self-center"
                                      size="icon"
                                      onClick={() => removeChoice(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  ))
                                : (
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
                                )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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

              {toBeEditedQuestionId &&
                (
                  <Link
                    href={back === "profile"
                      ? "/profile"
                      : `/feed/${toBeEditedQuestionId}`}
                    className="hover:underline text-sm self-center mt-1 hover:text-yellow-500 dark:hover:text-red-300"
                  >
                    Cancel
                  </Link>
                )}
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
