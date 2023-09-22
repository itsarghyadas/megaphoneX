import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-[calc(100vh-120px)] items-center justify-center">
      <div className="flex flex-col gap-y-10 items-center justify-center max-w-3xl mx-auto">
        <h1 className="font-black text-center text-2xl md:text-3xl lg:text-5xl xl:text-7xl">
          Free giveaway tool for Pre-Launch
        </h1>
        <Button variant={"default"} className="py-6 px-20 text-lg">
          Coming Soon
        </Button>
      </div>
    </main>
  );
}
