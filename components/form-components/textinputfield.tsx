import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TextInputFieldProps {
  label: string;
  name: string;
  control: any;
  placeholder?: string;
}

function TextInputField({
  label,
  name,
  control,
  placeholder,
}: TextInputFieldProps): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold underline underline-offset-4">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              spellCheck={false}
              autoComplete="off"
              placeholder={placeholder}
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
