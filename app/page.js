import { Button } from "@/components/ui/button";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect("sign-in");
}
