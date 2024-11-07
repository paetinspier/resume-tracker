import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Year {
  value: number;
  months: Month[];
}

interface Month {
  value: number;
  name: string;
  startDay: number;
  days: Date[];
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getDaysOfTheYear(year: number): Year {
  const months: Month[] = [];

  for (let month = 0; month < 12; month++) {
    const days: Date[] = [];
    const date = new Date(year, month, 1);

    // Loop through each day of the month
    while (date.getMonth() === month) {
      days.push(new Date(date)); // add a copy of the date
      date.setDate(date.getDate() + 1); // move to the next day
    }
    let startDay = days[0].getDay() - 1;
    if (startDay === -1) {
      startDay = 6;
    }

    months.push({
      value: month + 1,
      name: monthNames[month],
      startDay: startDay,
      days: days,
    });
  }

  return { value: year, months: months };
}
