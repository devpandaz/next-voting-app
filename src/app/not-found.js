import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="text-center justify-center items-center flex flex-col h-[75vh] space-y-2">
      <h1 className="text-xl text-red-400 text-bold">Not Found</h1>
      <p>Could not find requested resource.</p>
      <Button asChild>
        <Link href="/feed">Return to Feed</Link>
      </Button>
    </div>
  );
}
