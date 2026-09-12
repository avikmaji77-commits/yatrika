import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type GlassSelectOption = {
  value: string;
  label: string;
};

type GlassSelectProps = {
  value: string;
  options: GlassSelectOption[];
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  triggerClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  contentClassName?: string;
};

export function GlassSelect({
  value,
  options,
  onValueChange,
  label,
  placeholder = "Select",
  icon: Icon,
  triggerClassName,
  iconClassName,
  labelClassName,
  valueClassName,
  contentClassName,
}: GlassSelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-white shadow-sm outline-none transition duration-200 hover:border-white/20 hover:bg-white/10 focus-visible:border-sky-300/60 focus-visible:ring-2 focus-visible:ring-sky-300/25",
          triggerClassName,
        )}
      >
        {Icon ? (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sky-200 backdrop-blur-md ring-1 ring-white/15",
              iconClassName,
            )}
          >
            <Icon size={16} strokeWidth={2} />
          </span>
        ) : null}

        <span className="min-w-0 flex-1">
          {label ? (
            <span
              className={cn(
                "block text-[10px] font-bold uppercase tracking-wider text-slate-300/85",
                labelClassName,
              )}
            >
              {label}
            </span>
          ) : null}
          <SelectPrimitive.Value
            placeholder={placeholder}
            className={cn("block truncate text-sm font-semibold text-white", valueClassName)}
          />
        </span>

        <SelectPrimitive.Icon asChild>
          <ChevronDown
            size={16}
            className="shrink-0 text-slate-300 transition group-data-[state=open]:rotate-180 group-hover:text-white"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={8}
          className={cn(
            "z-[100] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-white/20 bg-slate-950/70 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            contentClassName,
          )}
        >
          <SelectPrimitive.Viewport className="p-1.5">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2.5 pr-9 text-sm font-medium text-slate-100 outline-none transition data-[highlighted]:bg-white/12 data-[highlighted]:text-white data-[state=checked]:bg-sky-400/20 data-[state=checked]:text-sky-50"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-3 inline-flex items-center justify-center text-sky-200">
                  <Check size={15} strokeWidth={2.4} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
