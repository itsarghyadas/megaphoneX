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
import exp from "constants";

interface TextInputFieldProps {
  control: any;
  name: string;
}

function TextInputField({ control, name }: TextInputFieldProps): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold underline underline-offset-4">
            Post URL
          </FormLabel>
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
  );
}

export default TextInputField;
