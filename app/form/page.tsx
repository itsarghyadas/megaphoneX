"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  posturl: z.string().nonempty(),
  dmmessage: z.string().nonempty(),
});

function onsubmit(data: FieldValues) {
  console.log(data);
}

export default function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onsubmit)}
        className="max-w-xl mx-auto space-y-8 py-20"
      >
        <FormField
          control={form.control}
          name="posturl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post URL</FormLabel>
              <FormControl>
                <Input
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="shadcn"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dmmessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DM Template</FormLabel>
              <FormControl>
                <Textarea
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="shadcn"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Start your giveaway</Button>
      </form>
    </Form>
  );
}
