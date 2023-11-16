"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-[calc(100vh-120px)] items-center justify-center">
      <div className="flex flex-col gap-y-8 items-center justify-center max-w-3xl mx-auto">
        <h1 className="font-black bg-gradient-to-br from-[#af8bee] via-rose-500 to-[#6903f6] text-transparent bg-clip-text text-center max-w-sm md:max-w-xl lg:max-w-4xl mx-auto text-4xl md:text-6xl lg:text-7xl">
          Free giveaway tool for Pre-Launch
        </h1>
        <Link
          href="/form"
          className={`rounded-full ${buttonVariants({
            variant: "default",
          })} h-11 w-fit px-14 text-[1.2rem] text-white bg-[radial-gradient(100%_100%_at_100%_0%,_#af8bee_0%,_#6903f6_100%)] transition-[box-shadow_0.15s_ease,_transform_0.15s_ease] shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:scale-95 active:-translate-y-0.5 active:shadow-[inset_0px_3px_7px_#6903f6] hover:text-white`}
        >
          Start your giveaway
        </Link>
      </div>
    </main>
  );
}
