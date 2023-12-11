"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MdTimer } from "react-icons/md";
import { FieldValues } from "react-hook-form";
import AutoDMForm from "@/components/autodmform";
import {
  getRetweetIds,
  getLikeIds,
  getQuoteIds,
  getReplyIds,
  sendDms,
  creditsCheck,
  creditsUpdate,
} from "@/util/twitterapicall";
import { getUserAccessTokenData } from "@/util/useracesstoken";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCreditsStore } from "@/providers/creditsprovider";
import { useSubmitStore } from "@/providers/formdisablestatecontext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DelayTimes = {
  [key: string]: number;
};

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;
const url = `${webUrl}api/formsubmit`;

export default function MainFormPage() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [tokenSecret, setTokenSecret] = useState<string>("");
  const { user } = useUser();
  const userId = user?.id;
  const { credits, setCredits } = useCreditsStore();
  const { isSubmitting, submitTime, setSubmitting } = useSubmitStore();

  const [remainingTime, setRemainingTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log("isSubmitting", isSubmitting);
  }, [isSubmitting]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (submitTime) {
      const diff = Date.now() - new Date(submitTime).getTime();
      if (diff < 1 * 60 * 1000) {
        const remaining = 1 * 60 * 1000 - diff;
        setRemainingTime(remaining);
        intervalId = setInterval(() => {
          setRemainingTime((prevRemainingTime) => prevRemainingTime - 1000);
        }, 1000);
        setTimeout(() => {
          setSubmitting(false, null);
          clearInterval(intervalId);
        }, remaining);
      } else {
        setSubmitting(false, null);
      }
    }
    return () => clearInterval(intervalId);
  }, [submitTime, setSubmitting]);

  // Convert remaining time from milliseconds to minutes and seconds
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = ((remainingTime % 60000) / 1000).toFixed(0);

  useEffect(() => {
    if (userId) {
      getUserAccessTokenData(userId, setToken, setTokenSecret);
    }
  }, [userId]);

  type TwitterApiCall = (
    tweetId: string,
    token: string,
    tokenSecret: string
  ) => Promise<any>;

  const twitterApiCalls: Record<string, TwitterApiCall> = {
    retweet: getRetweetIds,
    like: getLikeIds,
    quote: getQuoteIds,
    comment: getReplyIds,
  };

  async function getIdsFromTwitterApi(
    tweetId: string,
    token: string,
    tokenSecret: string,
    checkboxItems: string[]
  ) {
    const totalIdsArray: string[][] = [];

    for (const item of checkboxItems) {
      const apiCall = twitterApiCalls[item];
      if (apiCall) {
        try {
          const result = await apiCall(tweetId, token, tokenSecret);
          const ids = result.ids || result.authorIds;
          if (ids && ids.length > 0) {
            totalIdsArray.push(ids);
          }
        } catch (error) {
          console.log(
            `${item}__Error: Error occurred while getting ${item} ids in the client side`
          );
        }
      }
    }

    return totalIdsArray;
  }

  async function onsubmit(data: FieldValues) {
    setSubmitting(true, new Date().toISOString());
    toast.success("Your submission is done");
    console.log(data);
    data.userId = userId;
    const totalUserNumber: number = data.usernumber;
    // Update credits
    if (userId) {
      creditsUpdate(userId, totalUserNumber).then(() => {
        creditsCheck(userId).then((creditsScore) => {
          console.log("Credits score after update:", creditsScore);
          const credits = creditsScore.credits;
          console.log("Current credits after update check:", credits);
          setCredits(credits);
        });
      });
    }

    router.push("/dashboard");
    let timestamp: string = "";
    try {
      const saveInDB = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resultData = saveInDB.data;
      console.log("Data saved successfully", resultData.data);
      timestamp = resultData.data.timestamp;
    } catch (error: any) {
      console.error("API request failed", error.response.data);
    }
    const posturl: string = data.posturl;
    const message: string = data.dmmessage;
    const checkboxItems: string[] = data.checkboxItems;
    const executionTime: string = data.timeperiod;
    const matchedId: RegExpMatchArray | null = posturl.match(/\/status\/(\d+)/);
    if (!matchedId) {
      return;
    }
    const tweetId: string = matchedId[1];

    const delayTimes: DelayTimes = {
      "2mins": 1 * 5 * 1000,
      "24hours": 24 * 60 * 60 * 1000,
      "48hours": 48 * 60 * 60 * 1000,
    };

    let delayTime: number = delayTimes[executionTime] || 0;

    setTimeout(async () => {
      const totalIdsArray = await getIdsFromTwitterApi(
        tweetId,
        token,
        tokenSecret,
        checkboxItems
      );

      console.log("Total__IDs__array__in__result -", totalIdsArray);
      let commonIds: string[] = [];

      if (totalIdsArray.length === 0) {
        console.log("Total__Ids__Array is empty");
        return;
      }

      if (totalIdsArray.length < 2) {
        commonIds = totalIdsArray[0];
      } else {
        commonIds = totalIdsArray[0].filter((id: any) =>
          totalIdsArray.every((array) => array.includes(id))
        );
      }
      commonIds = commonIds.slice(
        0,
        Math.min(commonIds.length, totalUserNumber)
      );
      console.log("Final CommondID -", commonIds);

      // Send DMs to the commonIds
      try {
        await sendDms(
          tweetId,
          commonIds,
          token,
          tokenSecret,
          message,
          timestamp
        );
      } catch (error) {
        console.error("Error sending DMs", error);
      }
    }, delayTime);
  }

  return (
    <section className="form__page flex-col gap-y-2 py-10 h-full md:min-h-[calc(100vh-90px)] flex items-center justify-center">
      {isSubmitting && isMounted && (
        <Alert className="max-w-xl text-purple-500 flex items-center gap-x-2 mx-auto">
          <div className="border rounded-full p-1 border-purple-500">
            <MdTimer className="text-2xl fill-purple-500" />
          </div>
          <AlertDescription className="text-base font-medium">
            Form will be enabled in {minutes}:{Number(seconds) < 10 ? "0" : ""}
            {seconds}
          </AlertDescription>
        </Alert>
      )}
      <AutoDMForm onSubmit={onsubmit} disabled={isSubmitting} />
    </section>
  );
}
