import Link from "next/link";

export default function Home() {
  return (
    <div className="w-fit mx-auto">
      <h1>Home page</h1>
      <Link href="/feed">Go to feed</Link>
    </div>
  );
}
