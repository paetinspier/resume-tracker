import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="px-8 w-full flex flex-col justify-start items-start gap-8">
      <div className="w-full flex flex-row justify-between items-center px-8">
        <h1 className="text-3xl">Applications</h1>
        <Button className="flex flex-row justify-center items-center gap-2">
          <Plus />
          Add Application
        </Button>
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
