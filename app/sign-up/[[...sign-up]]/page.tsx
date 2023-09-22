import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            card: "bg-white dark:bg-transparent rounded-lg shadow-none border border-slate-400/20 drop-shadow-sm ",
          },
        }}
      />
    </div>
  );
}
