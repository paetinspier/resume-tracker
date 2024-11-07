import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingResumes() {
  return (
    <div className="px-8 w-full flex flex-col justify-start items-start gap-8">
      <div className="w-full flex flex-row justify-start items-center px-8">
        <h1 className="text-3xl">Resumes</h1>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <Skeleton className="h-[200px] w-[350px] rounded-xl" />
        <Skeleton className="h-[200px] w-[350px] rounded-xl" />
        <Skeleton className="h-[200px] w-[350px] rounded-xl" />
      </div>
    </div>
  );
}
