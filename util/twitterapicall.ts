import axios from "axios";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;

export async function getRetweetIds(
  tweetId: string,
  token: string,
  tokenSecret: string
) {
  try {
    const res = await axios.post(`${webUrl}api/retweet`, {
      tweetId,
      token,
      tokenSecret,
    });
    if (!res.data.success) {
      throw new Error("Failed to fetch retweet data");
    }
    return res.data;
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function getLikeIds(
  tweetId: string,
  token: string,
  tokenSecret: string
) {
  try {
    const res = await axios.post(`${webUrl}api/likes`, {
      tweetId,
      token,
      tokenSecret,
    });
    if (!res.data.success) {
      throw new Error("Failed to fetch liked data");
    }
    return res.data;
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function getQuoteIds(
  tweetId: string,
  token: string,
  tokenSecret: string
) {
  try {
    const res = await axios.post(`${webUrl}api/quote`, {
      tweetId,
      token,
      tokenSecret,
    });
    if (!res.data.success) {
      throw new Error("Failed to fetch quoted data");
    }
    return res.data;
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function getReplyIds(
  tweetId: string,
  token: string,
  tokenSecret: string
) {
  try {
    const res = await axios.post(`${webUrl}api/reply`, {
      tweetId,
      token,
      tokenSecret,
    });
    if (!res.data.success) {
      throw new Error("Failed to fetch reply data");
    }
    return res.data;
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function sendDms(
  tweetId: string,
  token: string,
  tokenSecret: string
) {
  try {
    const res = await axios.post(`${webUrl}api/directmessage`, {
      tweetId,
      token,
      tokenSecret,
    });
    if (!res.data.success) {
      throw new Error("Failed to send DM");
    }
    return res.data;
  } catch (error: any) {
    console.error(error.message);
  }
}
