"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/AuthContext";
import { getResumes } from "@/lib/firebase/storage";
import { FileUser } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingResumes from "./loading";

export default function ResumePage() {
  const [resumes, setResumes] = useState<{ url: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user) {
          const resumesData = await getResumes(user.uid);
          // Only set applications if the data has changed
          if (JSON.stringify(resumesData) !== JSON.stringify(resumes)) {
            setResumes(resumesData || []);
          }
        } else {
          setResumes([]);
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
  }, [user, resumes]); // Add 'applications' as a secondary dependency to avoid redundant fetches

  if (loading) return <LoadingResumes></LoadingResumes>;
  return (
    <div className="px-4 md:px-8 pb-20 h-full w-full flex flex-col justify-start items-start gap-8 relative">
      <div className="w-full flex flex-row justify-start items-center md:px-8 px-2">
        <h1 className="text-3xl">Resumes</h1>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full max-h-full overflow-y-scroll gap-4">
        {resumes.map((resume, index) => {
          return (
            <Card key={index} className="w-full flex justify-start items-start">
              <CardHeader className="w-full">
                <div className="w-full flex flex-row justify-start items-center">
                  <CardTitle>{resume.name}</CardTitle>
                </div>
                <div className="w-full flex flex-row justify-start items-center gap-2 overflow-hidden">
                  <CardDescription>
                    <FileUser size={16} />
                  </CardDescription>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      router.push(
                        `/portal/resumes/view/${encodeURIComponent(resume.url)}`,
                      )
                    }
                  >
                    View Resume
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
