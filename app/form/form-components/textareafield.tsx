import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps {
  label: string;
  name: string;
  control: any;
  placeholder?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  control,
  placeholder,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold flex items-center justify-between gap-x-3.5 pb-2.5 ">
            <div className="underline underline-offset-4">{label}</div>
            <div>
              <FormMessage className="text-xs border border-red-400/80 text-red-500/80 rounded-full px-1" />
            </div>
          </FormLabel>
          <FormControl>
            <Textarea
              className=" placeholder:text-gray-800/30"
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
};

export default TextareaField;
