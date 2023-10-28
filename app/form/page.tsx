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

    let retweetResult: any, likeResult: any, quoteResult: any, replyResult: any;

    setTimeout(async () => {
      if (checkboxItems.includes("retweet")) {
        retweetResult = await getRetweetIds(tweetId, token, tokenSecret);
      }
      if (checkboxItems.includes("like")) {
        likeResult = await getLikeIds(tweetId, token, tokenSecret);
      }
      if (checkboxItems.includes("quote")) {
        quoteResult = await getQuoteIds(tweetId, token, tokenSecret);
      }
      if (checkboxItems.includes("comment")) {
        replyResult = await getReplyIds(tweetId, token, tokenSecret);
      }
      let replyIds: string[] = [];
      let retweetIds: string[] = [];
      let likeIds: string[] = [];
      let quoteIds: string[] = [];

      if (replyResult) {
        replyIds = replyResult.authorIds;
      }

      if (retweetResult) {
        retweetIds = retweetResult.ids;
      }
      if (likeResult) {
        likeIds = likeResult.ids;
      }
      if (quoteResult) {
        quoteIds = quoteResult.ids;
      }
    }, delayTime);
  }

  return <AutoDMForm onSubmit={onsubmit} />;
}
