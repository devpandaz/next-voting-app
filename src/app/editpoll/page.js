import PollEditor from "@/components/PollEditor";

export default function Page({ searchParams }) {
  const toBeEditedQuestionId = searchParams.id;
  const back = searchParams.back;
  return <PollEditor toBeEditedQuestionId={toBeEditedQuestionId} back={back} />;
}

export const metadata = {
  title: "Edit poll",
};
