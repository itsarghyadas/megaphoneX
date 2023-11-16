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
          <FormLabel className="font-bold underline underline-offset-4">
            {label}
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaField;
