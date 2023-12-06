import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function FromtopAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        className="w-full bg-[#6903f6] text-white mx-auto font-medium text-base p-1 border-t-0 border-l-0 border-r-0 rounded-none"
      >
        <p className="cursor-pointer text-sm text-center">
          We have some Limitations 😓{" "}
          <span className="underline underline-offset-4">Learn More</span>
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Read this before you start 👋</AlertDialogTitle>
          <AlertDialogDescription className="text-justify">
            As we are on a Twitter API Basic plan, we don&apos;t have access to
            the <span className="font-bold text-blue-700">followers</span> API.
            Following you is a requirement to send DMs, so sometimes not
            everyone will receive the DM.
            <br />
            <br />
            But don&apos;t worry, we will give you a list of people who
            didn&apos;t get a DM so you can send it manually.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full">
          <AlertDialogAction className="bg-green-600 hover:bg-green-500">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
