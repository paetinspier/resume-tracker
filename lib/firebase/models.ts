import { Timestamp } from "firebase/firestore";

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeURL?: string;
  resumeName?: string;
  coverLetterURL?: string;
  coverLetterName?: string;
  appliedDate: Date;
  interviewStartDate?: Date;
  interviewEndDate?: Date;
  rejectionDate?: Date;
  offerDate?: Date;
  applicationSurceUrl?: string;
  status: string;
  notes: string;
}

export interface FirestoreJobApplicationResponse {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeURL: string;
  resumeName?: string;
  coverLetterURL: string;
  coverLetterName: string;
  appliedDate: Timestamp;
  interviewStartDate?: Timestamp;
  interviewEndDate?: Timestamp;
  rejectionDate?: Timestamp;
  offerDate?: Timestamp;
  status: string;
  notes?: string;
}

export function convertFirestoreJobApplicationResponse(
  response: FirestoreJobApplicationResponse,
): JobApplication {
  const jobApp: JobApplication = {
    id: response.id,
    companyName: response.companyName,
    jobTitle: response.jobTitle,
    jobDescription: response.jobDescription,
    resumeURL: response.resumeURL,
    resumeName: response.resumeName,
    coverLetterURL: response.coverLetterURL,
    coverLetterName: response.coverLetterName,
    appliedDate: new Date(response.appliedDate.seconds * 1000),
    rejectionDate: response.rejectionDate
      ? new Date(response.rejectionDate.seconds * 1000)
      : undefined,
    offerDate: response.offerDate
      ? new Date(response.offerDate.seconds * 1000)
      : undefined,
    status: response.status,
    notes: "",
  };
  if (response.interviewStartDate) {
    jobApp.interviewStartDate = new Date(
      response.interviewStartDate.seconds * 1000,
    );
  }
  if (response.interviewEndDate) {
    jobApp.interviewEndDate = new Date(
      response.interviewEndDate.seconds * 1000,
    );
  }

  return jobApp;
}

export enum JobApplicationStatus {
  APPLIED = "applied",
  INTERVIEWING = "interviewing",
  OFFERED = "offered",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
