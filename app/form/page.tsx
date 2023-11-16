"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { FieldValues } from "react-hook-form";
import AutoDMForm from "@/components/autodmform";
import {
  getRetweetIds,
  getLikeIds,
  getQuoteIds,
  getReplyIds,
} from "@/util/twitterapicall";
import { getUserAccessTokenData } from "@/util/useracesstoken";

type DelayTimes = {
  [key: string]: number;
};

export default function MainFormPage() {
  const [token, setToken] = useState<string>("");
  const [tokenSecret, setTokenSecret] = useState<string>("");
  const { user } = useUser();
  const userId = user?.id;

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
    console.log(data);

    const posturl: string = data.posturl;
    const message: string = data.dmmessage;
    const checkboxItems: string[] = data.checkboxItems;
    const executionTime: string = data.timeperiod;
    const totalUserNumber: number = data.usernumber;
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

      console.log(totalIdsArray);
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
      console.log(commonIds);
      commonIds = commonIds.slice(
        0,
        Math.min(commonIds.length, totalUserNumber)
      );
      console.log(commonIds);
    }, delayTime);
  }

  return <AutoDMForm onSubmit={onsubmit} />;
}
