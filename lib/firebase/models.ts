import { Timestamp } from "firebase/firestore";

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

export interface FirestoreJobApplicationResponse {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeURL: string;
  coverLetterURL: string;
  appliedDate: Timestamp;
  interviewStartDate?: Timestamp;
  rejectionDate?: Timestamp;
  status: string;
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
    coverLetterURL: response.coverLetterURL,
    appliedDate: new Date(response.appliedDate.seconds * 1000),
    rejectionDate: response.rejectionDate
      ? new Date(response.rejectionDate.seconds * 1000)
      : undefined,
    interviewStartDate: response.interviewStartDate
      ? new Date(response.interviewStartDate.seconds * 1000)
      : undefined,
    status: response.status,
  };
  return jobApp;
}

export enum JobApplicationStatus {
  APPLIED = "applied",
  INTERVIEWING = "interviewing",
  OFFERED = "offered",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
