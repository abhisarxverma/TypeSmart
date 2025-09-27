import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type CustomSelectProps = {
  label: string;
  options: string[];
  setValue: (value: string | null) => void;
};

export default function CustomSelect({ label, options, setValue }: CustomSelectProps) {
  const [selected, setSelected] = useState<string>("");

  return (
    <Select
      value={selected}
      onValueChange={(val) => {
        setSelected(val);
        setValue(val === "__placeholder__" ? null : val);
      }}
    >
      <SelectTrigger className="w-full min-w-[150px] border border-[var(--fc-label)]">
        <SelectValue placeholder={"Filter by "+label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>

          {/* Placeholder option with null value */}
          <SelectItem value="__placeholder__">{"All "+label}</SelectItem>

          {/* Dynamic options */}
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
