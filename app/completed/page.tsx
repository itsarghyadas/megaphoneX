"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCreditsStore } from "@/providers/creditsprovider";
import { creditsCheck } from "@/util/twitterapicall";
import { useSearchParams, useParams, useRouter } from "next/navigation";

export default function AfterPaymentRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
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
  }, [userId, setCredits]);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }
  }, [sessionId, router]);
  return sessionId ? (
    <div className="magicpattern absolute backdrop-blur-sm bg-background/50 inset-0 m-auto flex items-center justify-center">
      <div className="flex flex-col bg-white gap-y-5 border p-10 rounded-lg shadow-lg">
        <h2 className="max-w-xs mx-auto text-center">
          Your payment is successful, Now you can start your giveaway.{" "}
        </h2>

        <Link
          href="/dashboard"
          className={` ${buttonVariants({
            variant: "outline",
          })} w-full rounded-md bg-green-500 hover:bg-green-600 hover:text-white text-white mx-auto`}
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  ) : null;
}
