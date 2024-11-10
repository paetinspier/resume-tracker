import ApplicationLineChart from "@/components/ApplicationLineChart";
import React from "react";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col justify-center items-start gap-6 p-8">
      <div className="w-full">
        <ApplicationLineChart />
      </div>
    </div>
  );
}
