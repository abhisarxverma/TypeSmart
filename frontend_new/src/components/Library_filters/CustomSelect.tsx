import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type CustomSelectProps = {
  label: string;
  options: string[];
  setValue: (value: string | null) => void;
};

export default function CustomSelect({ label, options, setValue }: CustomSelectProps) {
  const [selected, setSelected] = useState<string>("all");

  // On mount, set default to null (meaning "All")
  useEffect(() => {
    setValue(null);
  }, [setValue]);

  return (
    <Select
      value={selected}
      onValueChange={(val) => {
        setSelected(val);
        setValue(val === "all" ? null : val);
      }}
    >
      <SelectTrigger className="w-full border-1 border-[var(--fc-label)]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>

          {/* Default "All" option */}
          <SelectItem value="all">All</SelectItem>

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
