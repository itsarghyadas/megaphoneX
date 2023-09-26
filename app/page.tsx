"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-[calc(100vh-120px)] items-center justify-center">
      <div className="flex flex-col gap-y-5 items-center justify-center max-w-3xl mx-auto">
        <h1 className="font-black text-center max-w-sm md:max-w-xl lg:max-w-5xl mx-auto text-4xl md:text-5xl lg:text-5xl xl:text-7xl">
          Free giveaway tool for Pre-Launch
        </h1>
        <Link
          href="/form"
          className={`${buttonVariants({
            variant: "default",
          })}py-6 px-14 text-lg font-semibold rounded-full`}
        >
          Click here
        </Link>
      </div>
    </main>
  );
}
