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
          <FormLabel className="font-bold flex items-center justify-between gap-x-2 pb-2.5 ">
            <div className="underline underline-offset-4">{label}</div>
            <div className="flex items-center justify-center gap-x-1">
              <FormMessage className="text-[13px] font-[550] text-red-500 animate-pulse" />
            </div>
          </FormLabel>
          <FormControl>
            <Input
              className="placeholder:text-gray-800/30"
              spellCheck={false}
              autoComplete="off"
              placeholder={placeholder}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default TextInputField;
