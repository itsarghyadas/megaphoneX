import axios from "axios";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;

async function makeTwitterApiRequest(
  endpoint: string,
  tweetId: string,
  token: string,
  tokenSecret: string
) {
  try {
    const res = await axios.post(`${webUrl}api/${endpoint}`, {
      tweetId,
      token,
      tokenSecret,
    });
    if (!res.data.success) {
      throw new Error(`Failed to fetch ${endpoint} data`);
    }
    if (res.data === undefined) {
      return "No data received from the server";
    } else {
      return res.data;
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

export const getRetweetIds = (
  tweetId: string,
  token: string,
  tokenSecret: string
) => makeTwitterApiRequest("retweet", tweetId, token, tokenSecret);
export const getLikeIds = (
  tweetId: string,
  token: string,
  tokenSecret: string
) => makeTwitterApiRequest("likes", tweetId, token, tokenSecret);
export const getQuoteIds = (
  tweetId: string,
  token: string,
  tokenSecret: string
) => makeTwitterApiRequest("quote", tweetId, token, tokenSecret);
export const getReplyIds = (
  tweetId: string,
  token: string,
  tokenSecret: string
) => makeTwitterApiRequest("reply", tweetId, token, tokenSecret);
export const sendDms = (tweetId: string, token: string, tokenSecret: string) =>
  makeTwitterApiRequest("directmessage", tweetId, token, tokenSecret);
