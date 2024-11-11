"use client";

import AddApplicationDialog from "@/components/add-application-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/firebase/firestore";
import { JobApplication, JobApplicationStatus } from "@/lib/firebase/models";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import {
  Building,
  Calendar,
  ClipboardList,
  FileBadge,
  FileUser,
  PartyPopper,
  Send,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ClientHomePageProps {
  initialApplications: JobApplication[];
}

export default function ClientHomePage({
  initialApplications,
}: ClientHomePageProps) {
  const [applications, setApplications] =
    React.useState<JobApplication[]>(initialApplications);
  const { user } = useAuth();
  const router = useRouter();

  const handleStatusChange = async (
    app: JobApplication,
    status: JobApplicationStatus,
  ) => {
    if (!user) {
      return;
    }
    try {
      const updatedApp = app;
      updatedApp.status = status;
      await updateJobApplication(user?.uid, app.id, {
        status: status,
      });
      const apps = applications.map((a) => {
        if (a.id === app.id) {
          a.status = status;
          return a;
        } else {
          return a;
        }
      });
      setApplications(apps);
      toast({
        title: "Update Job Application Status",
        description: `${app.status} -> ${updatedApp.status}`,
        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!user) {
      return;
    }
    try {
      await deleteJobApplication(user?.uid, id);
      const apps = applications.filter((a) => a.id !== id);
      setApplications(apps);
      toast({
        title: "Deleted Job Application",
        //description: ``,
        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return <div>Login page</div>;
  } else {
    return (
      <div className="md:px-8 px-4 pb-20 h-full w-full flex flex-col justify-start items-start gap-8 relative">
        <div className="w-full flex flex-row justify-between items-center px-2 md:px-8">
          <h1 className="md:text-3xl text-xl">Applications</h1>
          <AddApplicationDialog setApplications={setApplications} />
        </div>
        <Separator />

        <ScrollArea className="h-full max-h-[80vh] w-full rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full max-h-full overflow-y-scroll gap-4">
            {!applications && (
              <div className="w-full h-full">No applications current</div>
            )}
            {applications?.map((app, index) => {
              return (
                <ContextMenu key={app.id || index}>
                  <ContextMenuTrigger>
                    <Card className="w-full flex justify-start items-start">
                      <CardHeader className="w-full">
                        <div className="w-full flex flex-row justify-between items-center">
                          <CardTitle
                            onClick={() =>
                              router.push(`/portal/applications/${app.id}`)
                            }
                            className="cursor-pointer hover:underline"
                          >
                            {app.jobTitle}
                          </CardTitle>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Badge className="cursor-pointer">
                                {app.status}
                              </Badge>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">
                                    Status
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Set the status for the application.
                                  </p>
                                </div>
                                <div className="w-full flex flex-col justify-center items-center gap-2">
                                  <Button
                                    variant={
                                      app.status ===
                                      JobApplicationStatus.APPLIED
                                        ? "secondary"
                                        : "default"
                                    }
                                    disabled={
                                      app.status ===
                                      JobApplicationStatus.APPLIED
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        app,
                                        JobApplicationStatus.APPLIED,
                                      )
                                    }
                                    className="w-full"
                                  >
                                    <Send />
                                    Applied
                                  </Button>
                                  <Button
                                    variant={
                                      app.status ===
                                      JobApplicationStatus.INTERVIEWING
                                        ? "secondary"
                                        : "default"
                                    }
                                    disabled={
                                      app.status ===
                                      JobApplicationStatus.INTERVIEWING
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        app,
                                        JobApplicationStatus.INTERVIEWING,
                                      )
                                    }
                                    className="w-full"
                                  >
                                    <User />
                                    Interviewing
                                  </Button>
                                  <Button
                                    variant={
                                      app.status ===
                                      JobApplicationStatus.REJECTED
                                        ? "secondary"
                                        : "default"
                                    }
                                    disabled={
                                      app.status ===
                                      JobApplicationStatus.REJECTED
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        app,
                                        JobApplicationStatus.REJECTED,
                                      )
                                    }
                                    className="w-full"
                                  >
                                    <X />
                                    Rejected
                                  </Button>
                                  <Button
                                    variant={
                                      app.status ===
                                      JobApplicationStatus.OFFERED
                                        ? "secondary"
                                        : "default"
                                    }
                                    disabled={
                                      app.status ===
                                      JobApplicationStatus.OFFERED
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        app,
                                        JobApplicationStatus.OFFERED,
                                      )
                                    }
                                    className="w-full"
                                  >
                                    <FileBadge />
                                    Offered
                                  </Button>
                                  <Button
                                    variant={
                                      app.status ===
                                      JobApplicationStatus.ACCEPTED
                                        ? "secondary"
                                        : "default"
                                    }
                                    disabled={
                                      app.status ===
                                      JobApplicationStatus.ACCEPTED
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        app,
                                        JobApplicationStatus.ACCEPTED,
                                      )
                                    }
                                    className="w-full"
                                  >
                                    <PartyPopper />
                                    Accepted
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="w-full flex flex-row justify-start items-center gap-2">
                          <CardDescription>
                            <Building size={16} />
                          </CardDescription>
                          <CardDescription>{app.companyName}</CardDescription>
                        </div>
                        <div className="w-full flex flex-row justify-start items-center gap-2">
                          <CardDescription>
                            <Calendar size={16} />
                          </CardDescription>
                          <CardDescription>
                            {app.appliedDate.toDateString()}
                          </CardDescription>
                        </div>
                        <div className="w-full flex flex-row justify-start items-center gap-2 overflow-hidden">
                          <CardDescription>
                            <FileUser size={16} />
                          </CardDescription>
                          <Button
                            variant={"ghost"}
                            onClick={() =>
                              router.push(
                                `/portal/resumes/view/${encodeURIComponent(app.resumeURL)}`,
                              )
                            }
                            disabled={!app.resumeURL}
                          >
                            {app.resumeURL ? "View Resume" : " - "}
                          </Button>
                        </div>
                        <div className="w-full flex flex-row justify-start items-center gap-2 overflow-hidden">
                          <CardDescription>
                            <FileBadge size={16} />
                          </CardDescription>
                          <Button
                            variant={"ghost"}
                            disabled={!app.coverLetterURL}
                            onClick={() =>
                              router.push(
                                `/portal/coverletters/view/${encodeURIComponent(app.coverLetterURL)}`,
                              )
                            }
                          >
                            {app.coverLetterURL ? "View Cover Letter" : " - "}
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
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => handleDeleteApplication(app.id)}
                    >
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }
}
