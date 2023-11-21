"use client";

import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useSearchParams, useParams } from "next/navigation";
import ResultComponent from "@/components/resultcomponent";
import { Skeleton } from "@/components/ui/skeleton";
const webUrl = process.env.NEXT_PUBLIC_WEB_URL;
const url = `${webUrl}/api/tweetiddata`;

const fetchTweetData = async (url, timeperiod, id) => {
  const response = await axios.post(url, { timeperiod, id });
  console.log(response.data);
  return response.data;
};

const LoadingComponent = () => {
  return (
    <div className="max-w-sm mx-auto w-full flex flex-col gap-y-4 py-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-8 rounded-full w-8" />
            <Skeleton className="h-6 w-[150px] rounded-md" />
          </div>
          <div>
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Idmetrix() {
  const searchParams = useSearchParams();
  const timeperiod = searchParams.get("timeperiod");
  const { id } = useParams();

  const { data: fetchedUserData, isLoading } = useQuery(
    ["tweetData", url, timeperiod, id],
    () => fetchTweetData(url, timeperiod, id)
  );

  console.log(fetchedUserData);
  const sentUser = fetchedUserData?.sentDmUserData;
  const unsentUser = fetchedUserData?.unsentDmUserData;

  console.log(sentUser);
  console.log(unsentUser);
  return (
    <section className="py-14 md:py-20">
      <section className="flex flex-col gap-y-4 p-8 md:px-10 md:py-10">
        <h1 className="text-3xl font-bold text-center">Welcome 👋</h1>
        <p className="text-center max-w-md mx-auto">
          This is the dashboard page where you can see all the details about
          when and what giveaway campaign you have started.{" "}
        </p>
      </section>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        fetchedUserData && <ResultComponent sentUser={sentUser} unsentUser={unsentUser} />
      )}
    </section>
  );
}
