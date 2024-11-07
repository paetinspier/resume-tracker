export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeURL: string;
  coverLetterURL: string;
  appliedDate: Date;
  interviewStartDate?: Date;
  rejectionDate?: Date;
  status: string;
}

export enum JobApplicationStatus {
  APPLIED = "applied",
  INTERVIEWING = "interviewing",
  OFFERED = "offered",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
