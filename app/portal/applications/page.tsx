"use client";
import React, { useEffect, useState } from "react";
import { JobApplication } from "@/lib/firebase/models";
import { getJobApplications } from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import Loading from "@/app/loading";
import ClientHomePage from "@/app/client-page";

export default function Home() {
  const [applications, setApplications] = useState<JobApplication[]>();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      setFetching(true);
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
        setFetching(false);
      }
    };

    if (user && !fetching && !applications) {
      console.log("fetching applications");
      fetchApplications();
    }
  }, [user, applications]); // Add 'applications' as a secondary dependency to avoid redundant fetches

  if (loading) return <Loading></Loading>;

  return <ClientHomePage initialApplications={applications || []} />;
}
