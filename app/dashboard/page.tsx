"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { FcLike } from "react-icons/fc";
import { FaRetweet, FaReply, FaQuoteRight } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;
const url = `${webUrl}/api/dashboarddata`;

interface FetchedData {
  tweetID: string;
  timeperiod: string;
  usernumber: string;
  posturl: string;
  checkboxItems: string[];
  timestamp: string;
  status: string;
}

export default function MainDashboard() {
  const { user } = useUser();
  const username = user?.username;
  const userId = user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<FetchedData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!userId) {
        console.log("User ID is not available");
        return;
      }

      try {
        const result = await axios.post(
          url,
          {
            userId: userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const resultData = result.data;
        console.log("Data fetched successfully", resultData);
        const fetchedUserData = resultData.data;
        console.log("Fetched user data", fetchedUserData);
        setFetchedData(
          Array.isArray(fetchedUserData) ? fetchedUserData : [fetchedUserData]
        );
        setIsLoading(false);
      } catch (error: any) {
        console.error("API request failed", error.response.data);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    console.log("Fetched data", fetchedData);
  }, [fetchedData]);

  return (
    <section className="py-14 md:py-20">
      <div className="flex flex-col gap-y-4 p-8 md:px-10 md:py-10">
        <h1 className="text-3xl font-bold text-center">
          Welcome <span className="text-purple-500">{username}</span> 👋
        </h1>
        <p className="text-center max-w-md mx-auto">
          This is the dashboard page where you can see all the details about
          when and what giveaway campaign you have started.{" "}
        </p>
      </div>
      <div className="flex max-w-lg mx-auto w-full flex-col">
        {isLoading ? (
          <div className="flex flex-col gap-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-6 w-[200px]" />
                </div>
                <div>
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          fetchedData &&
          fetchedData.map((data, index) => (
            <div
              key={index}
              className="flex items-center justify-evenly border border-b-0 last:border-b lg:first:rounded-t-md lg:last:rounded-b-md py-3.5 lg:py-4"
            >
              <div className="w-4/5 md:w-2/3 flex flex-col gap-y-2 items-center justify-center">
                <div className="flex items-start gap-x-2.5">
                  <div className="flex flex-col gap-y-1.5">
                    <a
                      href={data.posturl}
                      className=" text-blue-500 font-medium underline underline-offset-4 text-sm"
                    >
                      {data.tweetID}
                    </a>
                    <div className="w-full flex gap-x-2 items-center justify-center">
                      {data.checkboxItems &&
                        data.checkboxItems.includes("like") && (
                          <FcLike className="text-sm" />
                        )}
                      {data.checkboxItems &&
                        data.checkboxItems.includes("retweet") && (
                          <FaRetweet className="text-base text-green-500" />
                        )}
                      {data.checkboxItems &&
                        data.checkboxItems.includes("comment") && (
                          <FaReply className="text-xs text-blue-500" />
                        )}
                      {data.checkboxItems &&
                        data.checkboxItems.includes("quote") && (
                          <FaQuoteRight className="text-xs text-orange-500" />
                        )}
                    </div>
                  </div>
                  <p className="w-full flex items-center justify-center text-xs md:text-sm font-medium border text-[#6903f6] rounded px-1.5 ">
                    {data.timeperiod}
                  </p>
                  <p className="w-full flex items-center justify-center text-xs md:text-sm font-medium border text-[#6903f6] rounded px-1.5">
                    {data.usernumber}
                  </p>
                </div>
              </div>
              <div className="w-1/3 flex gap-1 items-center justify-center">
                {data.status === "pending" ? (
                  <a
                    href={`/dashboard/${data.tweetID}?timeperiod=${data.timestamp}`}
                    className="mt-0.5 flex items-center justify-center text-sm font-medium bg-amber-400 text-black rounded-md h-8 w-20 px-3.5 py-2"
                  >
                    Pending
                  </a>
                ) : (
                  <a
                    href={`/dashboard/${data.tweetID}?timeperiod=${data.timestamp}`}
                    className="h-8 w-20 mt-0.5 flex items-center justify-center text-xs md:text-sm font-medium bg-green-500 text-white rounded-md px-3.5 py-2"
                  >
                    Done
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
