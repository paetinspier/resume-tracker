"use client";
import React, { useEffect, useState } from "react";
import ClientHomePage from "../client-page";
import { JobApplication } from "@/lib/firebase/models";
import { getJobApplications } from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import Loading from "../loading";

export default function Home() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user) {
          const applicationsData = await getJobApplications(user.uid);
          // Only set applications if the data has changed
          if (
            JSON.stringify(applicationsData) !== JSON.stringify(applications)
          ) {
            setApplications(applicationsData || []);
          }
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching job applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      console.log("fetching applications");
      fetchApplications();
    }
  }, [user, applications]); // Add 'applications' as a secondary dependency to avoid redundant fetches

  if (loading) return <Loading></Loading>;

  return <ClientHomePage initialApplications={applications} />;
}
