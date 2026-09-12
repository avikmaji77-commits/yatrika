import { useEffect, useMemo, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type GlassDatePickerProps = {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  icon?: LucideIcon;
  triggerClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  contentClassName?: string;
};

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDateValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  const date = parseDateValue(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function getCalendarDates(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const calendarStart = new Date(year, month, 1 - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });
}

export function GlassDatePicker({
  value,
  onValueChange,
  label = "When",
  icon: Icon = Calendar,
  triggerClassName,
  iconClassName,
  labelClassName,
  valueClassName,
  contentClassName,
}: GlassDatePickerProps) {
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  useEffect(() => {
    setVisibleMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  const calendarDates = useMemo(() => getCalendarDates(visibleMonth), [visibleMonth]);
  const monthLabel = visibleMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const shiftMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const selectDate = (date: Date) => {
    onValueChange(toDateValue(date));
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        type="button"
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-white shadow-sm outline-none transition duration-200 hover:border-white/20 hover:bg-white/10 focus-visible:border-sky-300/60 focus-visible:ring-2 focus-visible:ring-sky-300/25",
          triggerClassName,
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sky-200 backdrop-blur-md ring-1 ring-white/15",
            iconClassName,
          )}
        >
          <Icon size={16} strokeWidth={2} />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block text-[10px] font-bold uppercase tracking-wider text-slate-300/85",
              labelClassName,
            )}
          >
            {label}
          </span>
          <span className={cn("block truncate text-sm font-semibold text-white", valueClassName)}>
            {formatDisplayDate(value)}
          </span>
        </span>

        <Calendar
          size={15}
          className="shrink-0 text-slate-300 transition group-hover:text-white group-data-[state=open]:text-sky-200"
        />
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align="start"
          className={cn(
            "z-[100] w-80 rounded-2xl border border-white/20 bg-slate-950/75 p-3 text-white shadow-2xl shadow-slate-950/50 outline-none backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            contentClassName,
          )}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/12 hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="text-sm font-bold text-white">{monthLabel}</div>

            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/12 hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {weekdays.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {calendarDates.map((date) => {
              const isSelected = isSameDate(date, selectedDate);
              const isOutsideMonth = date.getMonth() !== visibleMonth.getMonth();
              const isToday = isSameDate(date, new Date());

              return (
                <button
                  key={toDateValue(date)}
                  type="button"
                  onClick={() => selectDate(date)}
                  className={cn(
                    "grid aspect-square place-items-center rounded-xl text-sm font-semibold transition",
                    isOutsideMonth ? "text-slate-500 hover:text-slate-200" : "text-slate-100",
                    "hover:bg-white/12 hover:text-white",
                    isToday && "ring-1 ring-sky-300/50",
                    isSelected &&
                      "bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25 hover:bg-sky-300 hover:text-slate-950",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
            <button
              type="button"
              onClick={() => selectDate(new Date())}
              className="rounded-full px-3 py-1.5 font-semibold text-sky-200 transition hover:bg-white/10 hover:text-white"
            >
              Today
            </button>
            <span className="text-slate-400">{formatDisplayDate(value)}</span>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
