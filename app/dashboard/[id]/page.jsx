"use client";

import { useQuery } from "react-query";
import axios from "axios";
import { useSearchParams, useParams } from "next/navigation";
import ResultComponent from "@/components/resultcomponent";
import { Skeleton } from "@/components/ui/skeleton";
import { FcLike } from "react-icons/fc";
import { FaRetweet, FaReply, FaQuoteRight } from "react-icons/fa";

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
  const condition = searchParams.get("condition");
  const totalUser = searchParams.get("total");
  const executiontTime = searchParams.get("executetime");
  const { id } = useParams();

  console.log(id);
  console.log(timeperiod);
  const conditionArray = condition.split(",");
  console.log(conditionArray);
  console.log(totalUser);
  console.log(executiontTime);

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
      <section className="flex flex-col gap-y-8 p-8 md:px-10 md:py-10 max-w-md mx-auto">
        <h1 className="text-3xl font-bold">Campaign Data</h1>
        <div className="flex flex-col mt-5 gap-y-3.5">
          <a
            href={`https://twitter.com/megaphonexuser/status/${id}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            TweetID{" "}
            <span className="text-blue-500 underline underline-offset-4">
              {id}
            </span>
          </a>
          <div className="w-full flex gap-x-2 items-center justify-start">
            Condtion:
            {conditionArray && conditionArray.includes("like") && (
              <FcLike className="text-base" />
            )}
            {conditionArray && conditionArray.includes("retweet") && (
              <FaRetweet className="text-lg text-green-500" />
            )}
            {conditionArray && conditionArray.includes("comment") && (
              <FaReply className="text-sm text-blue-500" />
            )}
            {conditionArray && conditionArray.includes("quote") && (
              <FaQuoteRight className="text-sm text-orange-500" />
            )}
          </div>
          <p>
            Total User: <span className="text-blue-500">{totalUser}</span>
          </p>
          <p>
            Execution Time:{" "}
            <span className="text-blue-500">{executiontTime}</span>
          </p>
        </div>
      </section>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        fetchedUserData && (
          <ResultComponent sentUser={sentUser} unsentUser={unsentUser} />
        )
      )}
    </section>
  );
}
