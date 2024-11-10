import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Building, ClipboardList, FileBadge, FileUser } from "lucide-react";
import { Button } from "./ui/button";
import { JobApplication } from "@/lib/firebase/models";

interface ApplicationCardProps {
  app: JobApplication;
  index: number;
}

export default function ApplicationCard({ app, index }: ApplicationCardProps) {
  return (
    <Card key={index} className="w-full flex justify-start items-start">
      <CardHeader className="w-full">
        <div className="w-full flex flex-row justify-between items-center">
          <CardTitle>{app.jobTitle}</CardTitle>
          <Badge>{app.status}</Badge>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-2">
          <CardDescription>
            <Building size={16} />
          </CardDescription>
          <CardDescription>{app.companyName}</CardDescription>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-2 overflow-hidden">
          <CardDescription>
            <FileUser size={16} />
          </CardDescription>
          <Button variant={"ghost"}>{app.resumeURL}</Button>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-2 overflow-hidden">
          <CardDescription>
            <FileBadge size={16} />
          </CardDescription>
          <Button variant={"ghost"} disabled={!app.coverLetterURL}>
            {app.coverLetterURL || " - "}
          </Button>
        </div>
        <div className="w-full flex flex-row justify-start items-start gap-2 overflow-hidden">
          <CardDescription className="pt-0.5">
            <ClipboardList size={16} />
          </CardDescription>
          {app.jobDescription.length > 250
            ? `${app.jobDescription.substring(0, 250)}...`
            : app.jobDescription}
        </div>
      </CardHeader>
    </Card>
  );
}
