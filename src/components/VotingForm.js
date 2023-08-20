"use client";
import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";

const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;

export default function VotingForm(props) {
  const [question, setQuestion] = useState(props.question);
  const [selected, setSelected] = useState(null);

  const vote = async (e) => {
    e.preventDefault();
    try {
      const body = { selected };
      const res = await fetch(`${WEBSITE_BASE_URL}/api/vote/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => res.json());
      setQuestion(res.question.question);
    } catch (err) {
      console.log(err);
    }
  };
  let content;
  if (question.choices.length > 0) {
    content = (
      <form onSubmit={vote}>
        {question.choices.map((choice) => (
          <div className="flex items-center space-x-2" key={choice.id}>
            <input
              type="radio"
              name="choice"
              value={choice.id}
              id={choice.id}
              onChange={(e) => {
                setSelected(e.target.value);
              }}
            />
            <Label htmlFor={choice.id}>
              {choice.choiceText}: {choice.votes} vote(s)
            </Label>
          </div>
        ))}
        <input disabled={!selected} type="submit" value="Vote" />
      </form>
    );
  } else {
    content = <h3>No choices are available for this poll question.</h3>;
  }

  return (
    <div className="w-fit mx-auto">
      <h1>{question.questionText}</h1>
      {content}
      <Link href="/">Back to home</Link>
    </div>
  );
}
