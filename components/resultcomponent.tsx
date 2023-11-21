"use client";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ResultComponentProps = {
  sentUser: { sentusers: string[]; sentprofileimageurl: string[] }[];
  unsentUser: { unsentusers: string[]; unsentprofileimageurl: string[] }[];
};
export default function ResultComponent({
  sentUser,
  unsentUser,
}: ResultComponentProps) {
  console.log(sentUser, unsentUser);
  return (
    <div className="max-w-sm mx-auto w-full">
      <Tabs defaultValue="sentuser" className="w-[400px]">
        <TabsList>
          <TabsTrigger
            value="sentuser"
            className="data-[state=active]:text-green-500"
          >
            Successful DM
          </TabsTrigger>
          <TabsTrigger
            value="unsentuser"
            className="data-[state=active]:text-red-500"
          >
            Unsuccessful DM
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sentuser">
          {" "}
          <div className="py-5">
            {sentUser.map((item, index) => (
              <div key={index} className="w-full flex flex-col gap-y-2">
                {item.sentusers.map((user: any, userIndex: any) => (
                  <div
                    key={userIndex}
                    className="flex items-center justify-between gap-x-2 p-2 px-5 border rounded-md"
                  >
                    <div className="flex items-center gap-x-2">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={item.sentprofileimageurl[userIndex]}
                        alt={`Profile Image ${userIndex}`}
                      />
                      <p>{user}</p>
                    </div>
                    ✅
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="unsentuser">
          <div className="py-5">
            {unsentUser.map((item, index) => (
              <div key={index} className="w-full flex flex-col gap-y-2">
                {item.unsentusers.map((user: any, userIndex: any) => (
                  <div
                    key={userIndex}
                    className="flex items-center justify-between gap-x-2 p-2 px-5 border rounded-md"
                  >
                    <div className="flex items-center gap-x-2">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={item.unsentprofileimageurl[userIndex]}
                        alt={`Profile Image ${userIndex}`}
                      />
                      <p>{user}</p>
                    </div>
                    <X color="red" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
