import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type AppOption = { value: string; label: string };

/** Select propio del sistema de diseño: fondo claro, foco teal y opciones sin truncados feos. */
export function AppSelect({
  value,
  onValueChange,
  options,
  placeholder = "Elegí una opción",
  className,
  ariaLabel,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: AppOption[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "bg-background data-[size=default]:h-11 w-full rounded-md text-sm [&>span]:truncate",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="py-2.5 text-sm">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
