import axios from "axios";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;

async function makePostRequest(url: string, data: object) {
  try {
    const res = await axios.post(url, data);
    if (!res || !res.data || !res.data.success) {
      throw new Error(`Failed to fetch ${url} data`);
    }
    return res.data;
  } catch (error: any) {
    console.error(error.message);
    return "No data received from the server";
  }
}

async function makeTwitterApiRequest(
  endpoint: string,
  tweetId: string,
  token: string,
  tokenSecret: string
) {
  const url = `${webUrl}api/${endpoint}`;
  const data = { tweetId, token, tokenSecret };
  return makePostRequest(url, data);
}

export const getRetweetIds = makeTwitterApiRequest.bind(null, "retweet");
export const getLikeIds = makeTwitterApiRequest.bind(null, "likes");
export const getQuoteIds = makeTwitterApiRequest.bind(null, "quote");
export const getReplyIds = makeTwitterApiRequest.bind(null, "reply");

export const sendDms = async (
  tweetId: string,
  token: string,
  tokenSecret: string,
  message: string
) => {
  const url = `${webUrl}api/directmessage`;
  const data = { tweetId, token, tokenSecret, message };
  return makePostRequest(url, data);
};
