"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import {
  getJobApplicationById,
  removeFieldFromJobApplication,
  updateJobApplication,
} from "@/lib/firebase/firestore";
import { JobApplication, JobApplicationStatus } from "@/lib/firebase/models";
import { uploadFile } from "@/lib/firebase/storage";
import { deleteField } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";

export default function ApplicationPage() {
  const params = useParams<{ appId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<{
    appliedDate: Date | null;
    interviewDates: DateRange | null;
    rejectionDate: Date | null;
    offerDate: Date | null;
  }>({
    appliedDate: null,
    interviewDates: null,
    rejectionDate: null,
    offerDate: null,
  });
  const [resumeInputKey, setResumeInputKey] = React.useState<number>(0);
  const [resume, setResume] = useState<File>();
  const [coverLetterInputKey, setCoverLetterInputKey] =
    React.useState<number>(0);
  const [coverLetter, setCoverLetter] = useState<File>();

  useEffect(() => {
    let isMounted = true; // Prevent re-runs due to Strict Mode double invocation

    async function fetchApp() {
      console.log("fetching application");
      try {
        if (!user) {
          return;
        }
        const res = await getJobApplicationById(user.uid, params.appId);
        if (res && isMounted) {
          // Check isMounted to avoid unwanted re-renders
          console.log("res", res);
          setValue("companyName", res.companyName);
          setValue("jobTitle", res.jobTitle);
          setValue("jobDescription", res.jobDescription);
          setValue("rejectionDate", res.rejectionDate);
          setValue("appliedDate", res.appliedDate);
          setValue("interviewStartDate", res.interviewStartDate);
          setValue("interviewEndDate", res.interviewEndDate);
          setValue("offerDate", res.offerDate);
          setValue("status", res.status);
          setValue("resumeURL", res.resumeURL);
          setValue("resumeName", res.resumeName);
          setValue("notes", res.notes);
          setValue("coverLetterURL", res.coverLetterURL);
          setValue("coverLetterName", res.coverLetterName);
          setValue("id", res.id);
          setValue("applicationSurceUrl", res.applicationSurceUrl);
          setValue("applicationSurceUrl", res.applicationSurceUrl);

          const initializeDates = {
            appliedDate: res.appliedDate || null,
            interviewDates: res.interviewStartDate
              ? {
                  from: res.interviewStartDate,
                  to: res.interviewEndDate,
                }
              : null,
            rejectionDate: res.rejectionDate || null,
            offerDate: res.offerDate || null,
          };
          setDates(initializeDates);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (user?.uid && params.appId) {
      fetchApp();
    }

    return () => {
      isMounted = false; // Clean-up function to avoid setting state if component unmounts
    };
  }, [user?.uid, params.appId]); // Limit dependencies to only `user.uid` and `params.appId`

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<JobApplication>();

  const onSubmit = async (data: JobApplication) => {
    setLoading(true);
    try {
      if (!user) {
        console.log("no user");
        return;
      }

      if (dates.appliedDate) {
        data.status = JobApplicationStatus.APPLIED;
        data.appliedDate = dates.appliedDate;
      } else {
        setError("appliedDate", {
          message: "Application Date is a required field",
        });
        return;
      }

      const jobAppPartial: Partial<JobApplication> = {
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        resumeURL: data.resumeURL,
        appliedDate: data.appliedDate,
        status: data.status,
      };

      if (data.notes) {
        jobAppPartial.notes = data.notes;
      } else {
        jobAppPartial.notes = "";
      }

      if (data.applicationSurceUrl) {
        jobAppPartial.applicationSurceUrl = data.applicationSurceUrl;
      } else {
        jobAppPartial.applicationSurceUrl = "";
      }

      // handle interview dates updates
      if (data.interviewStartDate || dates.interviewDates) {
        if (dates.interviewDates) {
          data.status = JobApplicationStatus.INTERVIEWING;
          data.interviewStartDate = dates.interviewDates.from;
          jobAppPartial.interviewStartDate = dates.interviewDates.from;

          data.interviewEndDate = dates.interviewDates.to;
          jobAppPartial.interviewEndDate = dates.interviewDates.to;
        } else {
          removeFieldFromJobApplication(user?.uid, data.id, {
            interviewStartDate: deleteField(),
          });

          removeFieldFromJobApplication(user?.uid, data.id, {
            interviewEndDate: deleteField(),
          });
          data.status = JobApplicationStatus.APPLIED;
        }
      }
      // handle rejection date updates
      if (data.rejectionDate || dates.rejectionDate) {
        if (dates.rejectionDate) {
          data.status = JobApplicationStatus.REJECTED;
          data.rejectionDate = dates.rejectionDate;
          jobAppPartial.rejectionDate = dates.rejectionDate;
        } else if (data.rejectionDate && !dates.rejectionDate) {
          data.rejectionDate = undefined;
          removeFieldFromJobApplication(user?.uid, data.id, {
            rejectionDate: deleteField(),
          });
        }
      }
      // handle offer date updates
      if (data.offerDate || dates.offerDate) {
        if (dates.offerDate) {
          data.status = JobApplicationStatus.OFFERED;
          data.offerDate = dates.offerDate;
          jobAppPartial.offerDate = dates.offerDate;
        } else if (data.offerDate && !dates.offerDate) {
          data.offerDate = undefined;
          removeFieldFromJobApplication(user?.uid, data.id, {
            offerDate: deleteField(),
          });
        }
      }

      if (resume) {
        const savedResume = await uploadFile(user.uid, resume, "resumes");
        data.resumeURL = savedResume.downloadUrl || "";
        data.resumeName = savedResume.name || undefined;
        jobAppPartial.resumeURL = savedResume.downloadUrl || undefined;
        jobAppPartial.resumeName = savedResume.name || undefined;
        setValue("resumeName", savedResume.name || undefined);
        setValue("resumeURL", savedResume?.downloadUrl || undefined);
      }

      if (coverLetter) {
        const savedCoverLetter = await uploadFile(
          user.uid,
          coverLetter,
          "cover-letters",
        );
        data.coverLetterURL = savedCoverLetter.downloadUrl || "";
        data.coverLetterName = savedCoverLetter.name || undefined;
        jobAppPartial.coverLetterName = savedCoverLetter.name || undefined;
        jobAppPartial.coverLetterURL =
          savedCoverLetter.downloadUrl || undefined;
        setValue("coverLetterName", savedCoverLetter.name || undefined);
      }

      jobAppPartial.status = data.status;
      setValue("status", data.status);
      await updateJobApplication(user?.uid, data.id, jobAppPartial);
      handleResumeReset();
      handleCoverLetterReset();

      toast({
        title: "Changes Saved",
      });
    } catch (err) {
      console.log("error with application/create method in dialog component");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e?.target?.files.length > 0) {
      setResume(e.target.files[0]);
    } else {
      setError("resumeURL", { message: "Failed to upload resume" });
    }
  };

  const handleResumeReset = () => {
    if (resume) {
      setResume(undefined);
      setResumeInputKey((prev) => prev + 1);
    }
  };

  const handleCoverLetterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e?.target?.files.length > 0) {
      setCoverLetter(e.target.files[0]);
    } else {
      setError("coverLetterURL", {
        message: "Failed to upload cover letter",
      });
    }
  };

  const handleCoverLetterReset = () => {
    if (coverLetter) {
      setCoverLetter(undefined);
      setCoverLetterInputKey((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full h-full flex justify-start items-start p-8">
      <Card>
        <CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-12">
              <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-col justify-start items-start gap-4">
                  <CardDescription>Company Name</CardDescription>
                  <Input {...register("companyName")} />
                </div>
                <Badge>{watch("status")}</Badge>
              </div>
              <div className="flex flex-col justify-start items-start gap-4">
                <CardDescription>Job Title</CardDescription>
                <Input {...register("jobTitle")} />
              </div>

              <div className="flex flex-col justify-start items-start gap-4">
                <CardDescription>
                  Job Application Source Url (optional)
                </CardDescription>
                <Input {...register("applicationSurceUrl")} />
              </div>
              <div className="flex flex-col justify-start items-start gap-4">
                <CardDescription>Job Description</CardDescription>
                <Textarea rows={8} {...register("jobDescription")} />
              </div>

              {/*<CardDescription>Application Status</CardDescription>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-56" variant="outline">
                    {application?.status}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup {...register("status")}>
                    <DropdownMenuItem textValue="applied">
                      <Send />
                      Applied
                    </DropdownMenuItem>
                    <DropdownMenuItem textValue="interviewing">
                      <User />
                      Interviewing
                    </DropdownMenuItem>
                    <DropdownMenuItem textValue="rejected">
                      <X />
                      Rejected
                    </DropdownMenuItem>
                    <DropdownMenuItem textValue="offered">
                      <FileBadge />
                      Offered
                    </DropdownMenuItem>
                    <DropdownMenuItem textValue="accepted">
                      <PartyPopper />
                      Accepted
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>*/}

              <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <div className="grid max-w-sm items-center gap-4">
                  <CardDescription>Date Applied</CardDescription>
                  <div className="rounded-md border w-64">
                    <Calendar
                      mode="single"
                      selected={dates?.appliedDate || undefined}
                      onSelect={(e) => {
                        setDates((prevDates) => ({
                          ...prevDates,
                          appliedDate: e || null,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="grid max-w-sm items-center gap-4">
                  <CardDescription>Interviewing Dates</CardDescription>
                  <div className="rounded-md border w-64">
                    <Calendar
                      mode="range"
                      selected={dates?.interviewDates || undefined}
                      onSelect={(e) => {
                        setDates((prevDates) => ({
                          ...prevDates,
                          interviewDates: e || null,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="grid max-w-sm items-center gap-4">
                  <CardDescription>Date Offered</CardDescription>
                  <div className="rounded-md border w-64">
                    <Calendar
                      mode="single"
                      selected={
                        dates?.offerDate instanceof Date
                          ? dates.offerDate
                          : undefined
                      }
                      onSelect={(e) => {
                        setDates((prevDates) => ({
                          ...prevDates,
                          offerDate: e || null,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="grid max-w-sm items-center gap-4">
                  <CardDescription>Rejection Date</CardDescription>
                  <div className="rounded-md border w-64">
                    <Calendar
                      mode="single"
                      selected={
                        dates?.rejectionDate instanceof Date
                          ? dates.rejectionDate
                          : undefined
                      }
                      onSelect={(e) => {
                        setDates((prevDates) => ({
                          ...prevDates,
                          rejectionDate: e || null,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="status">Upload Resume</Label>
                {watch("resumeName") && (
                  <Label>current: {watch("resumeName")}</Label>
                )}
                <Input
                  type="file"
                  key={resumeInputKey}
                  onChange={handleResumeUpload}
                />
                {resume && (
                  <Button variant={"destructive"} onClick={handleResumeReset}>
                    Remove
                  </Button>
                )}
                {errors.resumeURL ? (
                  <FormMessage className="text-red-400">
                    {errors.resumeURL.message}
                  </FormMessage>
                ) : null}
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="status">Upload Cover Letter</Label>
                {watch("coverLetterName") && (
                  <Label>current: {watch("coverLetterName")}</Label>
                )}
                <Input
                  type="file"
                  key={coverLetterInputKey}
                  onChange={handleCoverLetterUpload}
                />
                {coverLetter && (
                  <Button
                    variant={"destructive"}
                    onClick={handleCoverLetterReset}
                  >
                    Remove
                  </Button>
                )}
                {errors.coverLetterURL ? (
                  <FormMessage className="text-red-400">
                    {errors.coverLetterURL.message}
                  </FormMessage>
                ) : null}
              </div>
              <div className="flex flex-col justify-start items-start gap-4">
                <CardDescription>Notes</CardDescription>
                <Textarea rows={8} {...register("notes")} />
              </div>
              <div>
                <Button disabled={loading} type="submit">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </CardHeader>
      </Card>
    </div>
  );
}
