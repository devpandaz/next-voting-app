import PollEditor from "@/components/PollEditor";

export default function Page({ searchParams }) {
  const toBeEditedQuestionId = searchParams.id;
  const back = searchParams.back;
  console.log(toBeEditedQuestionId, back);
  return <PollEditor toBeEditedQuestionId={toBeEditedQuestionId} back={back} />;
}

export const metadata = {
  title: "Edit poll",
};
