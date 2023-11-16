import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RadioOption = {
  value: string;
  label: string;
};

interface RadioSelectorProps {
  control: any;
  name: string;
  radioOptions: RadioOption[];
  label: string;
}

function RadioSelector({
  control,
  name,
  radioOptions,
  label,
}: RadioSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="font-bold underline underline-offset-4">
            {label}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {radioOptions.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-3 space-y-0 border p-2 rounded-md"
                >
                  <FormControl>
                    <RadioGroupItem
                      className="text-[#6903f6]"
                      value={option.value}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default RadioSelector;
