// app/page.js
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard"); // if logged in
  } else {
    redirect("/sign-in"); // if not logged in
  }
}
