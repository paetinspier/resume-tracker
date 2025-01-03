import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn, getDaysOfTheYear, Year } from "@/lib/utils";
import { JobApplication } from "@/lib/firebase/models";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useRouter } from "next/navigation";

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

interface YearCalendarProps {
  year: number;
  setYear: (year: number) => void;
  jobApplications: JobApplication[];
}

export default function YearCalendar({
  year,
  setYear,
  jobApplications,
}: YearCalendarProps) {
  const [currentYear, setCurrentYear] = useState<Year>();
  const router = useRouter();

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
          <div className="relative flex items-center rounded-md bg-primary dark:bg-background md:items-stretch gap-4">
            <Button
              onClick={() => setYear(year - 1)}
              type="button"
              className="flex items-center justify-center gap-1"
            >
              <span className="sr-only">Previous year</span>
              <ChevronLeft />
              {year - 1}
            </Button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <Button
              onClick={() => setYear(year + 1)}
              type="button"
              className="flex items-center justify-center gap-1"
            >
              <span className="sr-only">Next year</span>
              {year + 1}
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
              <div className="mt-2 grid grid-cols-7 gap-px rounded-lg bg-primary dark:bg-background text-sm">
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
                      const jobApps = jobApplications.filter(
                        (ja) =>
                          ja.appliedDate.toDateString() === day.toDateString(),
                      );
                      return (
                        <HoverCard key={day.toDateString()}>
                          <HoverCardTrigger asChild>
                            <div
                              onClick={() => console.log(day)}
                              key={day.getDate()}
                              className={classNames(
                                dayIdx === 0 && "rounded-tl-lg",
                                dayIdx === 6 && "rounded-tr-lg",
                                dayIdx === month.days.length - 7 &&
                                  "rounded-bl-lg",
                                dayIdx === month.days.length - 1 &&
                                  "rounded-br-lg",
                                "py-1.5 focus:z-10 cursor-pointer",
                              )}
                            >
                              <time
                                dateTime={day.getDate().toString()}
                                className={classNames(
                                  day.toDateString() ===
                                    new Date().toDateString() &&
                                    "bg-accent text-accent-foreground border-white",
                                  jobApps.length > 0 &&
                                    jobApps.length <= 1 &&
                                    "bg-blue-200",
                                  jobApps.length > 1 &&
                                    jobApps.length <= 3 &&
                                    "bg-blue-400",
                                  jobApps.length > 3 && "bg-blue-600",
                                  cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "h-10 w-10 p-0 font-normal bg-opacity-70 aria-selected:opacity-100 border border-transparent",
                                  ),
                                )}
                              >
                                {day.getUTCDate()}
                              </time>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="z-50">
                            <div className="w-full flex flex-col justify-center items-start gap-2">
                              <div className="text-primary pb-2">
                                Job Applications
                              </div>
                              {jobApps.map((a) => {
                                return (
                                  <Button
                                    key={a.id}
                                    onClick={() =>
                                      router.push(
                                        `/portal/applications/${a.id}`,
                                      )
                                    }
                                    className="w-full"
                                  >
                                    {a.companyName}
                                  </Button>
                                );
                              })}
                              {jobApps.length > 1 && (
                                <Button className="w-full">See All</Button>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
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
