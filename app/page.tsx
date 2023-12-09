"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreditsStore } from "@/providers/creditsprovider";
import { creditsCheck } from "@/util/twitterapicall";
import { useUser } from "@clerk/nextjs";

const GradientShadowButton = () => {
  const { isSignedIn } = useUser();
  return (
    <div className="group relative w-full transition-transform duration-300 active:scale-95">
      <button className="relative z-10 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-0.5 duration-300 group-hover:scale-[1.035]">
        <Link
          href={isSignedIn ? "/form" : "/sign-in"}
          className="block rounded-md bg-slate-950 px-10 py-2 font-semibold text-slate-100 duration-300 group-hover:bg-slate-950/50 group-hover:text-slate-50 group-active:bg-slate-950/80"
        >
          Start your giveaway
        </Link>
      </button>
      <span className="pointer-events-none absolute -inset-2 z-0 transform-gpu rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur-2xl transition-all duration-300 group-hover:opacity-90 group-active:opacity-50" />
    </div>
  );
};

export default function Home() {
  const { user, isSignedIn } = useUser();
  const userId = user?.id;
  const { credits, setCredits } = useCreditsStore();
  useEffect(() => {
    if (userId) {
      creditsCheck(userId).then((credtsScore) => {
        const credits = credtsScore.credits;
        console.log("Current credits in main page:", credits);
        setCredits(credits);
      });
    }
  }, [userId, setCredits]);
  return (
    <main className="flex flex-col items-center justify-center">
      <section className=" relative flex h-[88vh] flex-col items-center justify-center px-7 pb-8 pt-2 md:p-10 md:pt-0">
        <div className="button-container relative isolate mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-4 py-7 md:flex-row md:py-10">
          <div className="available-left-side-line relative isolate hidden lg:block"></div>
          <div className="bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 p-0.5 rounded-full">
            <Button
              className="w-full rounded-full py-2 h-8 bg-white text-primary hover:bg-white md:w-fit"
              variant="default"
            >
              <a href="/pricing">Check our pricing</a>
            </Button>
          </div>
          <div className="available-right-side-line relative isolate hidden lg:block"></div>
        </div>
        <div className="left-side-big-line relative isolate mx-auto flex max-w-4xl flex-col items-center">
          <h1 className="headline-container relative isolate p-5 text-center text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
            The perfect platform to start a pre launch giveaway.
          </h1>
          <p className="paragraph-container relative isolate p-5 py-10 text-center text-base font-medium text-muted-foreground md:text-lg xl:text-xl">
            Want to do some giveaways before your launch? We got you covered. We
            provide you with a platform to do giveaways and get some customers
            before your launch.
          </p>
        </div>
        <div className="button-container relative isolate mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-4 py-8 md:py-10 lg:py-14 md:flex-row">
          <div className="left-side-line relative isolate hidden lg:block"></div>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="flex flex-col w-full md:flex-row gap-y-2 items-center gap-x-5">
              <GradientShadowButton />
            </div>
          </div>
          <div className="right-side-line relative isolate hidden lg:block"></div>
        </div>
      </section>
    </main>
  );
}
