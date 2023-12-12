"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import TextInputField from "@/app/form/form-components/textinputfield";
import TextareaField from "@/app/form/form-components/textareafield";
import CheckboxItem from "@/app/form/form-components/checkboxitem";
import RadioSelector from "@/app/form/form-components/radiogroup";
import {
  executionTimeOptions,
  totalUserNumbers,
  checkboxItems,
} from "@/data/formitemsdata";
import { useCreditsStore } from "@/providers/creditsprovider";

const FormSchema = z.object({
  posturl: z
    .string()
    .min(1)
    .regex(/^https:\/\/twitter\.com\/[a-zA-Z0-9_]{1,15}\/status\/\d+$/, {
      message: "Invalid Twitter link",
    }),
  dmmessage: z.string().min(10, { message: "Minimum 10 characters required" }),
  checkboxItems: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "* You have to select at least one item.",
    }),
  timeperiod: z.enum(["2mins", "24hours", "48hours"], {
    required_error: "* You need to select one time period.",
  }),
  usernumber: z.enum(["50", "100", "200"], {
    required_error: "* You need to select total user number.",
  }),
});

interface AutoDmFormProps {
  onSubmit: (data: FieldValues) => void;
  disabled?: boolean;
}

export default function AutoDMForm({ onSubmit, disabled }: AutoDmFormProps) {
  const { user } = useUser();
  const userId = user?.id;
  const { credits } = useCreditsStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checkboxItems: [],
      dmmessage:
        "Hello! How are you? I hope you are doing well. Here it is your giveaway result.",
    },
  });

  return (
    <div className="form__container bg-white max-w-xl w-full mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:border md:rounded-lg md:shadow-[0px_0px_40px_-25px_rgba(0,0,0,0.25)] flex flex-col gap-y-4 p-8 md:px-10 md:py-10"
        >
          <TextInputField
            label="Post URL"
            control={form.control}
            name="posturl"
            placeholder="https://twitter.com/username/status/1234567890"
          />
          <TextareaField
            label="DM Template"
            name="dmmessage"
            control={form.control}
            placeholder="Hey! How are you?"
          />
          <CheckboxItem
            label="Conditions"
            name="checkboxItems"
            control={form.control}
            checkboxItems={checkboxItems}
          />
          <RadioSelector
            control={form.control}
            name="timeperiod"
            label="Select the time period"
            radioOptions={executionTimeOptions}
          />
          <RadioSelector
            control={form.control}
            name="usernumber"
            label="Total User"
            radioOptions={totalUserNumbers}
          />
          {!userId ? (
            <Button
              className="w-full text-[0.95rem] text-white bg-gray-300 cursor-not-allowed"
              type="button"
              disabled
            >
              Loading...
            </Button>
          ) : credits < 50 ? (
            <Button
              className="w-full text-[0.95rem] text-white bg-red-500 hover:bg-red-500 hover:bg-red-500/50 hover:text-white cursor-not-allowed transition-all duration-150 ease-in-out"
              type="button"
              onClick={() => toast.error("Insufficient credits")}
              suppressHydrationWarning
            >
              Insufficient credits
            </Button>
          ) : (
            <div
              className=" cursor-pointer"
              onClick={() => {
                if (disabled) {
                  toast.error("Wait until the form is enabled");
                }
              }}
            >
              <Button
                className={`w-full text-[0.95rem] text-white ${
                  disabled
                    ? "bg-red-500 hover:shadow-none hover:text-white cursor-not-allowed transition-all duration-150 ease-in-out"
                    : "bg-[radial-gradient(100%_100%_at_100%_0%,_#af8bee_0%,_#6903f6_100%)] transition-[box-shadow_0.15s_ease,_transform_0.15s_ease] shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:translate-y-0.5 active:-translate-y-0.5 active:shadow-[inset_0px_3px_7px_#6903f6] hover:text-white"
                } `}
                type="submit"
                disabled={disabled}
              >
                Start your giveaway
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
