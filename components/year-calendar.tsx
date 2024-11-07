import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { getDaysOfTheYear, Year } from "@/lib/utils";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface YearCalendarProps {
  year: number;
  setYear: (year: number) => void;
}

export default function YearCalendar({ year, setYear }: YearCalendarProps) {
  const [currentYear, setCurrentYear] = useState<Year>();
  useEffect(() => {
    if (year && currentYear?.value !== year) {
      setCurrentYear(getDaysOfTheYear(year));
    }
  }, [year]);

  return (
    <div>
      <header className="flex items-center justify-between border-b border-primary px-6 py-4">
        <h1 className="text-base font-semibold text-primary">
          <time dateTime={`${currentYear?.value}` || "2024"}>
            {currentYear?.value || " - "}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-primary dark:bg-background md:items-stretch">
            <Button
              onClick={() => setYear(year - 1)}
              type="button"
              className="flex items-center justify-center"
            >
              <span className="sr-only">Previous year</span>
              <ChevronLeft />
            </Button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <Button
              onClick={() => setYear(year + 1)}
              type="button"
              className="flex items-center justify-center"
            >
              <span className="sr-only">Next year</span>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </header>
      <div className="bg-primary dark:bg-background">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4">
          {currentYear?.months?.map((month) => (
            <section key={month.name} className="text-center">
              <h2 className="text-primary dark:text-primary">{month.name}</h2>
              <div className="mt-6 grid grid-cols-7 text-primary dark:text-primary">
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
                <div>S</div>
              </div>
              <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-primary dark:bg-background text-sm">
                {new Array(month.startDay)
                  .fill(new Date())
                  .concat(month.days)
                  .map((day: Date, dayIdx: number) => {
                    if (dayIdx < month.startDay) {
                      return (
                        <div
                          key={day.getDate()}
                          className={classNames(
                            dayIdx === 0 && "rounded-tl-lg",
                            dayIdx === 6 && "rounded-tr-lg",
                            dayIdx === month.days.length - 7 && "rounded-bl-lg",
                            dayIdx === month.days.length - 1 && "rounded-br-lg",
                            "py-1.5 focus:z-10",
                          )}
                        >
                          {" "}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={day.getDate()}
                          className={classNames(
                            dayIdx === 0 && "rounded-tl-lg",
                            dayIdx === 6 && "rounded-tr-lg",
                            dayIdx === month.days.length - 7 && "rounded-bl-lg",
                            dayIdx === month.days.length - 1 && "rounded-br-lg",
                            "py-1.5 focus:z-10",
                          )}
                        >
                          <time
                            dateTime={day.getDate().toString()}
                            className={classNames(
                              day === new Date() &&
                                "bg-primary dark:bg-background text-primary dark:text-primary",
                              "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                            )}
                          >
                            {day.getUTCDate()}
                          </time>
                        </div>
                      );
                    }
                  })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
