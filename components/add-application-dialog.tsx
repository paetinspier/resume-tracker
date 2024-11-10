"use client";
import React, { useState } from "react";
import { addDays, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Controller, useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarIcon, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { FormMessage } from "./ui/form";
import { useToast } from "@/hooks/use-toast";
import { JobApplication } from "@/lib/firebase/models";
import {
  addJobApplication,
  getJobApplications,
} from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { uploadFile } from "@/lib/firebase/storage";

interface AddApplicationDialogProps {
  setApplications: (apps: JobApplication[]) => void;
}

export default function AddApplicationDialog({
  setApplications,
}: AddApplicationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState<Date>();
  const [resumeInputKey, setResumeInputKey] = React.useState<number>(0);
  const [coverLetterInputKey, setCoverLetterInputKey] =
    React.useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const [resume, setResume] = useState<File>();
  const [coverLetter, setCoverLetter] = useState<File>();

  const {
    handleSubmit,
    register,
    watch,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<JobApplication>();

  const onSubmit = async (data: JobApplication) => {
    setLoading(true);
    try {
      if (date) {
        data.appliedDate = date;
      } else {
        setError("appliedDate", { message: "required" });
        return;
      }
      if (!user) {
        console.log("no user error");
        return;
      }
      // save resume and cover letter documents
      if (resume) {
        const savedResume = await uploadFile(user.uid, resume, "resumes");
        data.resumeURL = savedResume || "";
      }

      if (coverLetter) {
        const savedCoverLetter = await uploadFile(
          user.uid,
          coverLetter,
          "cover-letters",
        );
        data.coverLetterURL = savedCoverLetter || "";
      }

      console.log("data", data);
      await addJobApplication(user.uid, data);
      const applications = await getJobApplications(user.uid);

      setApplications(applications || []);

      toast({
        title: "Tracking Job Application",
        //description: "Friday, February 10, 2023 at 5:57 PM",
        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
      reset();
      setOpen(false);
    } catch (err) {
      console.log("error with application/create method in dialog component");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateBySelect = (value: string) => {
    setDate(addDays(new Date(), parseInt(value)));
  };

  const handleDateByCalendar = (value: Date | undefined) => {
    setDate(value);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex flex-row justify-center items-center gap-2">
          <Plus />
          <div className="hidden md:block">Add Application</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Application</DialogTitle>
          <DialogDescription>
            Add create application description later
          </DialogDescription>
          <div className="w-full pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  {...register("companyName", { required: "required" })}
                />
                {errors.companyName ? (
                  <FormMessage className="text-red-400">
                    {errors.companyName.message}
                  </FormMessage>
                ) : null}
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" {...register("jobTitle")} />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea id="jobDescription" {...register("jobDescription")} />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => {
                    return (
                      <Select onValueChange={field.onChange} {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Application stauts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interviewing">
                              Interviewing
                            </SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="offered">Offered</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }}
                ></Controller>
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="status">Date Applied</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                    <Select onValueChange={handleDateBySelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="-1">Yesterday</SelectItem>
                        <SelectItem value="-2">Two days ago</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="rounded-md border">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(e) => handleDateByCalendar(e)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="status">Upload Resume</Label>
                <Input
                  type="file"
                  key={resumeInputKey}
                  onChange={handleResumeUpload}
                />
                {watch("resumeURL") && (
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
                <Input
                  type="file"
                  key={coverLetterInputKey}
                  onChange={handleCoverLetterUpload}
                />
                {watch("coverLetterURL") && (
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

              <div>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
