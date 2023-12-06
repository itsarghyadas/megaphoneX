"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { FcLike } from "react-icons/fc";
import { FaRetweet, FaReply, FaQuoteRight } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // get the data for done status
  if (fetchedData) {
    const pendingData = fetchedData?.filter(
      (data) => data.status === "pending"
    );
    console.log("Pending data", pendingData);
  }

  // find out the timestamp from doneData
  if (fetchedData) {
    const doneData = fetchedData?.filter((data) => data.status === "Done");
    console.log("Done data", doneData);
  }

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

      <div className="flex max-w-[22rem] mx-auto w-full flex-col gap-y-12 py-10">
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
          <Tabs defaultValue="done" className="w-[350px]">
            <TabsList className="mb-10">
              <TabsTrigger value="done">Done</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <TabsContent value="done">
              {" "}
              <div className="flex flex-col gap-y-10">
                {fetchedData
                  ?.filter((data) => data.status === "Done")
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={index}
                      className="tweet__container bg-white flex gap-x-10 relative items-center justify-between border py-3.5 lg:py-2.5 px-3.5 hover:bg-gray-50 rounded-md"
                    >
                      <div className="absolute -top-[25px] left-2 md:-top-5 md:-left-8 ">
                        <p className="relative bg-green-500 text-white shadow-sm border border-transparent h-5 w-5 rounded flex items-center justify-center text-xs">
                          {index + 1}
                        </p>
                        <div className="w-5 h-1 border-b absolute top-2 left-5 -z-10 "></div>
                      </div>
                      <p className="text-xs text-slate-500/70 absolute left-12 -top-[25px] md:-top-[22px] rounded-md rounded-b-none md:left-2 px-2 py-[3.5px] md:py-0.5 border z-30 w-fit ">
                        {item.timestamp}
                      </p>
                      <div className="flex flex-col gap-y-2 items-center justify-center">
                        <div className="flex items-start gap-x-2.5">
                          <div className="flex flex-col gap-y-1.5">
                            <a
                              href={item.posturl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" text-blue-500 font-medium underline underline-offset-4 text-sm"
                            >
                              {item.tweetID}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <a
                          href={`/dashboard/${item.tweetID}?timeperiod=${item.timestamp}&condition=${item.checkboxItems}&total=${item.usernumber}&executetime=${item.timeperiod}`}
                          className="h-8 w-20 mt-0.5 flex items-center justify-center text-xs md:text-sm font-medium bg-green-500 hover:bg-neutral-800 hover:text-white text-white rounded-md px-3.5 py-2"
                        >
                          Done
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent className="" value="pending">
              {" "}
              <div className="flex flex-col gap-y-10">
                {fetchedData
                  ?.filter((data) => data.status === "pending")
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={index}
                      className="tweet__container bg-white flex gap-x-10 relative items-center justify-between border py-3.5 lg:py-2.5 px-3.5 hover:bg-gray-50 rounded-md"
                    >
                      <div className="absolute -top-[25px] left-2 md:-top-5 md:-left-8 ">
                        <p className="relative bg-amber-500 text-white shadow-sm border border-transparent h-5 w-5 rounded flex items-center justify-center text-xs">
                          {index + 1}
                        </p>
                        <div className="w-5 h-1 border-b absolute top-2 left-5 -z-10 "></div>
                      </div>
                      <p className="text-xs text-slate-500/70 absolute left-12 -top-[25px] md:-top-[22px] rounded-md rounded-b-none md:left-2 px-2 py-[3.5px] md:py-0.5 border z-30 w-fit ">
                        {item.timestamp}
                      </p>
                      <div className="flex flex-col gap-y-2 items-center justify-center">
                        <div className="flex items-start gap-x-2.5">
                          <div className="flex flex-col gap-y-1.5">
                            <a
                              href={item.posturl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" text-blue-500 font-medium underline underline-offset-4 text-sm"
                            >
                              {item.tweetID}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <a
                          href={`/dashboard/${item.tweetID}?timeperiod=${item.timestamp}&condition=${item.checkboxItems}&total=${item.usernumber}&executetime=${item.timeperiod}`}
                          className="h-8 w-20 mt-0.5 flex items-center justify-center text-xs md:text-sm font-medium bg-amber-500 hover:bg-neutral-800 hover:text-white text-white rounded-md px-3.5 py-2"
                        >
                          Done
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
}
