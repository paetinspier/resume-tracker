import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Building, ClipboardList, FileBadge, FileUser } from "lucide-react";
import { Button } from "./ui/button";

interface ApplicationCardProps {
  app: Application;
  index: any;
}

export default function ApplicationCard({ app, index }: ApplicationCardProps) {
  return (
    <Card key={index} className="w-full flex justify-start items-start">
      <CardHeader className="w-full">
        <div className="w-full flex flex-row justify-between items-center">
          <CardTitle>{app.JobTitle}</CardTitle>
          <Badge>{app.Status}</Badge>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-2">
          <CardDescription>
            <Building size={16} />
          </CardDescription>
          <CardDescription>{app.CompanyName}</CardDescription>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-2 overflow-hidden">
          <CardDescription>
            <FileUser size={16} />
          </CardDescription>
          <Button variant={"ghost"}>{app.ResumeTitle}</Button>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-2 overflow-hidden">
          <CardDescription>
            <FileBadge size={16} />
          </CardDescription>
          <Button variant={"ghost"} disabled={!app.CoverLetterTitle}>
            {app.CoverLetterTitle || " - "}
          </Button>
        </div>
        <div className="w-full flex flex-row justify-start items-start gap-2 overflow-hidden">
          <CardDescription className="pt-0.5">
            <ClipboardList size={16} />
          </CardDescription>
          {app.JobDescription.length > 250
            ? `${app.JobDescription.substring(0, 250)}...`
            : app.JobDescription}
        </div>
      </CardHeader>
    </Card>
  );
}
