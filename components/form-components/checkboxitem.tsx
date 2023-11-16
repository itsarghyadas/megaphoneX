import {
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type CheckboxOption = {
  number: number;
  id: string;
  label: string;
};

type CheckboxItemProps = {
  label: string;
  name: string;
  control: any;
  checkboxItems: CheckboxOption[];
};

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  name,
  control,
  checkboxItems, // Add this line
}) => {
  return (
    <div className="flex flex-col gap-y-3.5">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold underline underline-offset-4">
              {label}
            </FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {checkboxItems.map((item) => (
                <FormItem
                  key={item.id}
                  className="space-y-0 flex items-center gap-x-3 border p-2 rounded-md"
                >
                  <FormControl>
                    <Checkbox
                      className="border-gray-300 rounded data-[state=checked]:bg-[#6903f6]"
                      checked={field.value?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, item.id])
                          : field.onChange(
                              field.value?.filter(
                                (value: any) => value !== item.id
                              )
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
export default CheckboxItem;
