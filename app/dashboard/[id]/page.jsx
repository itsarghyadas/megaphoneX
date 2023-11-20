"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;
const url = `${webUrl}/api/tweetiddata`;

export default function Idmetrix() {
  const [fetchedData, setFetchedData] = useState([]);
  const searchParams = useSearchParams();
  const timeperiod = searchParams.get("timeperiod");
  const { id } = useParams();

  useEffect(() => {
    axios
      .post(url, {
        timeperiod: timeperiod,
        id: id,
      })
      .then((response) => {
        setFetchedData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, timeperiod]);

  return (
    <section className="py-14 md:py-20">
      <div className="flex flex-col gap-y-4 p-8 md:px-10 md:py-10">
        <h1 className="text-3xl font-bold text-center">Welcome 👋</h1>
        <p className="text-center max-w-md mx-auto">
          This is the dashboard page where you can see all the details about
          when and what giveaway campaign you have started.{" "}
        </p>
        <div>
          {fetchedData.map((item, index) => (
            <p key={index}>{JSON.stringify(item.userID)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
