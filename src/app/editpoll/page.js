import PollEditor from "@/components/PollEditor";

export default function Page({ searchParams }) {
  const toBeEditedQuestionId = searchParams.id;
  return <PollEditor toBeEditedQuestionId={toBeEditedQuestionId} />;
}

export const metadata = {
  title: "Edit poll",
};
