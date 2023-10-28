"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { object, string, z } from "zod";
import TextInputField from "@/components/ui/form-components/textinputfield";
import TextareaField from "@/components/ui/form-components/textareafield";
import CheckboxItem from "@/components/ui/form-components/checkboxitem";
import RadioSelector from "@/components/ui/form-components/radiogroup";
import {
  executionTimeOptions,
  totalUserNumbers,
  checkboxItems,
} from "@/data/formitemsdata";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;

function getRetweetIds(tweetId: string, token: string, tokenSecret: string) {
  fetch(`${webUrl}api/retweet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tweetId, token, tokenSecret }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch retweet data");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success === false) {
        throw new Error("Failed to fetch retweet data");
      }
      console.log(data);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function getLikeIds(tweetId: string, token: string, tokenSecret: string) {
  fetch(`${webUrl}api/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tweetId, token, tokenSecret }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch liked data");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success === false) {
        throw new Error("Failed to fetch liked data");
      }
      console.log(data);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function getQuoteIds(tweetId: string, token: string, tokenSecret: string) {
  fetch(`${webUrl}api/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tweetId, token, tokenSecret }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch quoted data");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success === false) {
        throw new Error("Failed to fetch quoted data");
      }
      console.log(data);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function getReplyIds(tweetId: string, token: string, tokenSecret: string) {
  fetch(`${webUrl}api/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tweetId, token, tokenSecret }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch reply data");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success === false) {
        throw new Error("Failed to fetch reply data");
      }
      console.log(data);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function getFollowIds(tweetId: string, token: string, tokenSecret: string) {
  fetch(`${webUrl}api/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tweetId, token, tokenSecret }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch follow data");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success === false) {
        throw new Error("Failed to fetch follow data");
      }
      console.log(data);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function sendDms(tweetId: string, token: string, tokenSecret: string) {
  fetch(`${webUrl}api/directmessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tweetId, token, tokenSecret }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to send DM");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success === false) {
        throw new Error("Failed to send DM");
      }
      console.log(data);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function getUserAccessTokenData(
  userId: string,
  setToken: Function,
  setTokenSecret: Function
) {
  fetch(`${process.env.NEXT_PUBLIC_WEB_URL}api/accesstoken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    })
    .then((data) => {
      setToken(data?.token);
      setTokenSecret(data?.tokenSecret);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function ProfileForm() {
  const [token, setToken] = useState("");
  const [tokenSecret, setTokenSecret] = useState("");
  const { user } = useUser();
  const userId = user?.id;

  const FormSchema = object({
    posturl: string().min(1),
    dmmessage: string().min(1),
    checkboxItems: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "* You have to select at least one item.",
      }),
    timeperiod: z.enum(["2mins", "24hours", "48hours"], {
      required_error: "* You need to select one time period.",
    }),
    usernumber: z.enum(["50", "100", "200"], {
      required_error: "* You need to select total user number.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checkboxItems: [],
    },
  });

  useEffect(() => {
    if (userId) {
      getUserAccessTokenData(userId, setToken, setTokenSecret);
    }
  }, [userId]);

  function onsubmit(data: FieldValues) {
    console.log(data);
    const checkboxItems = data.checkboxItems;
    const executionTime = data.timeperiod;
    const totalUserNumber = data.usernumber;
    const posturl = data.posturl;
    const matchedId = posturl.match(/\/status\/(\d+)/);
    if (!matchedId) {
      return;
    }
    const tweetId = matchedId[1];

    let delayTime;

    switch (executionTime) {
      case "2mins":
        delayTime = 1 * 1 * 1000;
        break;
      case "24hours":
        delayTime = 24 * 60 * 60 * 1000;
        break;
      case "48hours":
        delayTime = 48 * 60 * 60 * 1000;
        break;
      default:
        delayTime = 0;
    }
    if (checkboxItems.includes("retweet")) {
      setTimeout(() => getRetweetIds(tweetId, token, tokenSecret), delayTime);
    }
    if (checkboxItems.includes("like")) {
      setTimeout(() => getLikeIds(tweetId, token, tokenSecret), delayTime);
    }
    if (checkboxItems.includes("quote")) {
      setTimeout(() => getQuoteIds(tweetId, token, tokenSecret), delayTime);
    }
    if (checkboxItems.includes("comment")) {
      setTimeout(() => getReplyIds(tweetId, token, tokenSecret), delayTime);
    }
    sendDms(tweetId, token, tokenSecret);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onsubmit)}
        className="max-w-xl mx-auto space-y-8 px-7 md:px-10 py-10 lg:py-20"
      >
        <TextInputField
          label="Post URL"
          control={form.control}
          name="posturl"
          placeholder="https://twitter.com/username/status/1234567890"
        />
        <TextareaField
          label="DM Template"
          name="dmmessage"
          control={form.control}
          placeholder="Hey! How are you?"
        />
        <CheckboxItem
          label="Conditions"
          name="checkboxItems"
          control={form.control}
          checkboxItems={checkboxItems}
        />
        <RadioSelector
          control={form.control}
          name="timeperiod"
          label="Select the time period"
          radioOptions={executionTimeOptions}
        />
        <RadioSelector
          control={form.control}
          name="usernumber"
          label="Total User"
          radioOptions={totalUserNumbers}
        />
        <Button
          className="w-full"
          role="button"
          type="submit"
          aria-label="Start your giveaway"
        >
          Start your giveaway
        </Button>
      </form>
    </Form>
  );
}
