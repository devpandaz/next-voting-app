import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { useToast } from "@/components/ui/use-toast";

export default function QuestionContextMenu(
  { children, uid, questionId, currentChoiceId, submitting, setSubmitting },
) {
  const { toast } = useToast();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={async () => {
            setSubmitting(true);
            try {
              const body = {
                uid: uid,
                questionId: questionId,
                currentChoiceId: currentChoiceId,
              };
              await fetch("/api/retract-vote/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              });
              setSubmitting(false);
            } catch (err) {
              toast({
                title: "Vote retract failed. ",
                variant: "destructive",
              });
            }
          }}
          disabled={!uid || !currentChoiceId || submitting}
        >
          Retract vote
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
