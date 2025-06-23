// app/auth/sign-in/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left half: illustration + overlay text at bottom */}
      <div className="relative hidden md:block">
        <Image
          src="/back1.webp"
          alt="Background illustration"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col h-full justify-end px-12 pb-12 text-white">
          <div className="mb-4">
            <Image
                src="/log.svg"
                alt="Logo"
                width={48}
                height={48}
                className="filter invert"
            />
          </div>

          <h1 className="text-4xl font-bold mb-2">
            Welcome to AI Interview Mocker{" "}
            <span role="img" aria-label="octopus">
              🐙
            </span>
          </h1>
          <p className="max-w-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            nam dolorum aliquam, quibusdam aperiam voluptatum.
          </p>
        </div>
      </div>

      {/* Right half: Clerk sign-in card */}
      <div className="flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
