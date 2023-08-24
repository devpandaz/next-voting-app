"use client";
import VotingForm from "@/components/VotingForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { LoadingWebsite } from "@/app/loading";

const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;

export default async function Question({ params }) {
  const { questionId } = params;

  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [question, setQuestion] = useState();

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

  return (
    <div className="w-fit mx-auto">
      <h1>{question.questionText}</h1>
      {question.choices.length > 0
        ? <VotingForm question={question} />
        : <h3>No choices are available for this poll question.</h3>}
      <Link href="/feed">Back to home</Link>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { questionId } = params;

  const question = await prisma.question.findUniqueOrThrow({
    where: {
      id: parseInt(questionId),
    },
  });

  return {
    title: question.questionText,
  };
}

export async function generateStaticParams() {
  const questions = await prisma.question.findMany();
  return questions.map((question) => ({
    questionId: question.id.toString(),
  }));
}

export const dynamic = "force-dynamic";
