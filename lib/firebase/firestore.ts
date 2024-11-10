import {
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";
import {
  convertFirestoreJobApplicationResponse,
  FirestoreJobApplicationResponse,
  JobApplication,
} from "./models";

// Add a job application for a specific user
export const addJobApplication = async (
  userId: string,
  application: JobApplication,
) => {
  console.log("application data", application);
  const applicationRef = doc(
    collection(firestore, "users", userId, "applications"),
  );
  await setDoc(applicationRef, application);
};

// Get all job applications for a specific user
export const getJobApplications = async (userId: string) => {
  try {
    const q = query(collection(firestore, "users", userId, "applications"));
    const querySnapshot = await getDocs(q);
    const res = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreJobApplicationResponse[];

    return res.map((doc) => {
      return convertFirestoreJobApplicationResponse(doc);
    }) as JobApplication[];
  } catch (err) {
    console.log(err);
  }
};

// Update a job application for a specific user
export const updateJobApplication = async (
  userId: string,
  applicationId: string,
  updatedFields: Partial<JobApplication>,
) => {
  const applicationRef = doc(
    firestore,
    "users",
    userId,
    "applications",
    applicationId,
  );
  await updateDoc(applicationRef, updatedFields);
};

export const deleteJobApplication = async (
  userId: string,
  applicationId: string,
) => {
  const applicationRef = doc(
    firestore,
    "users",
    userId,
    "applications",
    applicationId,
  );

  await deleteDoc(applicationRef);
};
