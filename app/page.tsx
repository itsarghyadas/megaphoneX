"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreditsStore } from "@/providers/creditsprovider";
import { creditsCheck } from "@/util/twitterapicall";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
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
  }, [userId]);
  return (
    <main className="flex flex-col items-center justify-center">
      <section className=" relative flex h-[88vh] flex-col items-center justify-center px-7 pb-8 pt-2 md:p-10 md:pt-0">
        <div className="button-container relative isolate mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-4 py-7 md:flex-row md:py-10">
          <div className="available-left-side-line relative isolate hidden lg:block"></div>
          <div>
            <Button
              className="w-full rounded-full border-2 bg-transparent py-2 text-primary md:w-[200px]"
              variant="default"
            >
              We are available 🟢
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
            <div className="flex flex-col md:flex-row gap-y-2 items-center gap-x-5">
              <Link
                href="/form"
                className={`rounded-full ${buttonVariants({
                  variant: "default",
                })} h-11 w-fit px-14 text-[18px] text-white bg-[radial-gradient(100%_100%_at_100%_0%,_#af8bee_0%,_#6903f6_100%)] transition-[box-shadow_0.15s_ease,_transform_0.15s_ease] shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:scale-[.98] active:-translate-y-0.5 active:shadow-[inset_0px_3px_7px_#6903f6] hover:text-white duration-100 ease-linear`}
              >
                Start your giveaway
              </Link>
              <Link
                href="/pricing"
                className={`rounded-full ${buttonVariants({
                  variant: "default",
                })} h-11 w-full md:w-fit px-14 text-[18px] text-white bg-[radial-gradient(100%_100%_at_100%_0%,_orange_0%,_red_100%)] transition-[box-shadow_0.15s_ease,_transform_0.15s_ease] shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:scale-[.98] active:-translate-y-0.5 active:shadow-[inset_0px_3px_2px_red] hover:text-white duration-100 ease-linear`}
              >
                Buy Credits
              </Link>
            </div>
          </div>
          <div className="right-side-line relative isolate hidden lg:block"></div>
        </div>
      </section>
    </main>
  );
}
