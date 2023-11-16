"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import TextInputField from "@/components/form-components/textinputfield";
import TextareaField from "@/components/form-components/textareafield";
import CheckboxItem from "@/components/form-components/checkboxitem";
import RadioSelector from "@/components/form-components/radiogroup";
import {
  executionTimeOptions,
  totalUserNumbers,
  checkboxItems,
} from "@/data/formitemsdata";

const FormSchema = z.object({
  posturl: z.string().min(1),
  dmmessage: z.string().min(1),
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
}

export default function AutoDMForm({ onSubmit }: AutoDmFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checkboxItems: [],
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl mx-auto flex flex-col gap-y-4 p-8 md:px-10 md:py-10"
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
        <Button
          className="w-full text-[0.95rem] text-white bg-[radial-gradient(100%_100%_at_100%_0%,_#af8bee_0%,_#6903f6_100%)] transition-[box-shadow_0.15s_ease,_transform_0.15s_ease] shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_2px_rgba(0,0,0,0.8)] hover:translate-y-0.5 active:-translate-y-0.5 active:shadow-[inset_0px_3px_7px_#6903f6] hover:text-white"
          role="button"
          type="submit"
          aria-label="Start your giveaway"
        >
          Start your giveaway
        </Button>
      </form>
    </Form>
  );
}