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
    if (res.data === undefined) {
      return "No data received from the server";
    } else {
      return res.data;
    }
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
    if (res.data === undefined) {
      return "No data received from the server";
    } else {
      return res.data;
    }
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
    if (res.data === undefined) {
      return "No data received from the server";
    } else {
      return res.data;
    }
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
    if (res.data === undefined) {
      return "No data received from the server";
    } else {
      return res.data;
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function sendDms(
  tweetId: string,
  commonIds: string[],
  token: string,
  tokenSecret: string,
  message: string,
  timestamp: string
) {
  try {
    const res = await axios.post(`${webUrl}api/directmessage`, {
      tweetId,
      commonIds,
      token,
      tokenSecret,
      message,
      timestamp,
    });
    if (!res.data.success) {
      throw new Error("Failed to send DM");
    }
    if (res.data === undefined) {
      return "No data received from the server";
    } else {
      console.log("res.data in sendDms", res.data);
      return res.data;
    }
  } catch (error: any) {
    console.error(error.message);
  }
}
