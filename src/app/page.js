"use client";
import { CardWithForm } from "@/components/card-demo";
import { CardDemo } from "@/components/card-example";
import { ContextMenuDemo } from "@/components/context-menu-example";
import Link from "next/link";

export default function Home() {
  // pusher example
  // const [notifications, setNotifications] = useState([]);
  //
  // console.log(notifications);

  // useEffect(() => {
  //   const channel = pusher_client.subscribe("channel");
  //
  //   channel.bind("event", (data) => {
  //     console.log(data);
  //     setNotifications([...notifications, data]);
  //   });
  //
  //   return () => {
  //     pusher_client.unsubscribe("channel");
  //   };
  // }, [notifications]);

  // setInterval(async () => {
  //   const body = { data: "asdasd" };
  //   const res = await fetch("/api/pusher-trigger/", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(body),
  //   });
  //   console.log(res);
  // }, 60000); // refresh every minute

  return (
    <div className="w-fit mx-auto">
      <h1>Home page</h1>
      <Link href="/feed">Go to feed</Link>
      <CardDemo />
      <CardWithForm />
      {
        /*<ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>*/
      }
      <ContextMenuDemo />
    </div>
  );
}
