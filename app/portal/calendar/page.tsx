"use client";
import YearCalendar from "@/components/year-calendar";
import { useAuth } from "@/lib/AuthContext";
import { getJobApplications } from "@/lib/firebase/firestore";
import { JobApplication } from "@/lib/firebase/models";
import React, { useEffect, useState } from "react";

export default function CalendarPage() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
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

  return <YearCalendar year={year} setYear={setYear}></YearCalendar>;
}
