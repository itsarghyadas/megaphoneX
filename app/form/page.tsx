"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, FieldValues } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import oAuth from "oauth-1.0a";
import crypto from "crypto";

const bearerToken = process.env.TWITTER_BEARER_KEY;

function getRetweetIds(tweetId: string) {
  console.log(tweetId);
  const res = axios.get(
    `https://api.twitter.com/2/tweets/1705077498579665067/retweeted_by`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );
  res.then((res) => {
    console.log(res.data);
  });
}

const oauth = new oAuth({
  consumer: {
    key: process.env.CONSUMER_APY_KEY || "",
    secret: process.env.CONSUMER_APY_SECRET || "",
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

const formSchema = z.object({
  posturl: z.string().nonempty(),
  dmmessage: z.string().nonempty(),
});

export default function ProfileForm() {
  const [token, setToken] = useState("");
  const [tokenSecret, setTokenSecret] = useState("");
  useEffect(() => {
    console.log(token, tokenSecret);
  }, [token, tokenSecret]);

  function getUserAccessTokenData(userId: string) {
    fetch("http://localhost:3000/api/accesstoken", {
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

  function onsubmit(data: FieldValues) {
    console.log(data);
    const posturl = data.posturl;
    const matchedId = posturl.match(/\/status\/(\d+)/);

    if (!matchedId) {
      return;
    }

    const tweetId = matchedId[1];
    console.log(tweetId);

    getRetweetIds(tweetId);
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { user } = useUser();
  const userId = user?.id;
  useEffect(() => {
    if (userId) {
      getUserAccessTokenData(userId);
    }
  }, [userId]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onsubmit)}
        className="max-w-xl mx-auto space-y-8 px-10 py-20"
      >
        <FormField
          control={form.control}
          name="posturl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post URL</FormLabel>
              <FormControl>
                <Input
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="shadcn"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dmmessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DM Template</FormLabel>
              <FormControl>
                <Textarea
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="shadcn"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Start your giveaway</Button>
      </form>
    </Form>
  );
}
