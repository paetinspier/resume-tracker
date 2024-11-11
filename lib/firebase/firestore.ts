import {
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  where,
  getDoc,
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

export const getJobApplicationById = async (
  userId: string,
  applicationId: string,
) => {
  try {
    if (!userId || !applicationId) return;

    // Directly reference the specific document using `doc` and `getDoc`
    const docRef = doc(
      firestore,
      "users",
      userId,
      "applications",
      applicationId,
    );
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No document found.");
      return null;
    }

    // Retrieve the document data and convert it
    const data = {
      id: docSnap.id,
      ...docSnap.data(),
    } as FirestoreJobApplicationResponse;

    const res = convertFirestoreJobApplicationResponse(data) as JobApplication;
    console.log(res);
    return res;
  } catch (err) {
    console.log("Error retrieving job application:", err);
    return null;
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
