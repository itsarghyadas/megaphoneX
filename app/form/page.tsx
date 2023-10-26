"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { object, string, z } from "zod";

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

const checkboxItems = [
  {
    number: 1,
    id: "retweet",
    label: "Retweet",
  },
  {
    number: 2,
    id: "comment",
    label: "Comment",
  },
  {
    number: 3,
    id: "like",
    label: "Like",
  },
  {
    number: 4,
    id: "quote",
    label: "Quote",
  },
];

export default function ProfileForm() {
  const [token, setToken] = useState("");
  const [tokenSecret, setTokenSecret] = useState("");
  const { user } = useUser();
  const userId = user?.id;

  const FormSchema = object({
    posturl: string().nonempty(),
    dmmessage: string().nonempty(),
    checkboxItems: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
    type: z.enum(["2mins", "24hours", "48hours"], {
      required_error: "You need to select a notification type.",
    }),
    usernumber: z.enum(["50", "100", "200"], {
      required_error: "You need to select total user number.",
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
    const posturl = data.posturl;
    const matchedId = posturl.match(/\/status\/(\d+)/);
    if (!matchedId) {
      return;
    }
    const tweetId = matchedId[1];
    getRetweetIds(tweetId, token, tokenSecret);
    getLikeIds(tweetId, token, tokenSecret);
    getQuoteIds(tweetId, token, tokenSecret);
    getReplyIds(tweetId, token, tokenSecret);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onsubmit)}
        className="max-w-xl mx-auto space-y-8 px-10 py-10"
      >
        <FormField
          control={form.control}
          name="posturl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold underline underline-offset-4">
                Post URL
              </FormLabel>
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
              <FormLabel className="font-bold underline underline-offset-4">
                DM Template
              </FormLabel>
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
        <div className="flex flex-col gap-y-3.5">
          <FormLabel className="font-bold underline underline-offset-4">
            Conditions
          </FormLabel>
          {checkboxItems.map((item) => (
            <FormField
              key={item.number}
              control={form.control}
              name="checkboxItems"
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.id}
                    className="space-y-0 flex items-center gap-x-2"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== item.id
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-y-3.5">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="font-bold underline underline-offset-4">
                  Execute after
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="2mins" />
                      </FormControl>
                      <FormLabel className="font-normal">2 mins</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="24hours" />
                      </FormControl>
                      <FormLabel className="font-normal">24 hours</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="48hours" />
                      </FormControl>
                      <FormLabel className="font-normal">48 hours</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-y-3.5">
          <FormField
            control={form.control}
            name="usernumber"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="font-bold underline underline-offset-4">
                  Total User
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="50" />
                      </FormControl>
                      <FormLabel className="font-normal">50</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="100" />
                      </FormControl>
                      <FormLabel className="font-normal">100</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="200" />
                      </FormControl>
                      <FormLabel className="font-normal">200</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Start your giveaway</Button>
      </form>
    </Form>
  );
}
