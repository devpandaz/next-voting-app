import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="justify-center items-center flex flex-col h-[80vh]">
      <p>Not Found</p>
      <p>Could not find requested resource.</p>
      <Button asChild className="mt-1">
        <Link href="/feed">Return to Feed</Link>
      </Button>
    </div>
  );
}
