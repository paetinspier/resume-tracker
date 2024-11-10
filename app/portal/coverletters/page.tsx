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
import { getCoverLetters } from "@/lib/firebase/storage";
import { FileUser } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingCoverLetters from "./loading";

export default function CoverLetterPage() {
  const [coverLetters, setCoverLetters] = useState<
    { url: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user) {
          const coverLettersData = await getCoverLetters(user.uid);
          // Only set applications if the data has changed
          if (
            JSON.stringify(coverLettersData) !== JSON.stringify(coverLetters)
          ) {
            setCoverLetters(coverLettersData || []);
          }
        } else {
          setCoverLetters([]);
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
  }, [user, coverLetters]); // Add 'applications' as a secondary dependency to avoid redundant fetches

  if (loading) return <LoadingCoverLetters></LoadingCoverLetters>;
  return (
    <div className="md:px-8 px-4 pb-20 h-full w-full flex flex-col justify-start items-start gap-8 relative">
      <div className="w-full flex flex-row justify-start items-center md:px-8 px-2">
        <h1 className="text-3xl">CoverLetters</h1>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full max-h-full overflow-y-scroll gap-4">
        {coverLetters.map((coverLetter, index) => {
          return (
            <Card key={index} className="w-full flex justify-start items-start">
              <CardHeader className="w-full">
                <div className="w-full flex flex-row justify-start items-center">
                  <CardTitle>{coverLetter.name}</CardTitle>
                </div>
                <div className="w-full flex flex-row justify-start items-center gap-2 overflow-hidden">
                  <CardDescription>
                    <FileUser size={16} />
                  </CardDescription>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      router.push(
                        `/portal/coverletters/view/${encodeURIComponent(coverLetter.url)}`,
                      )
                    }
                  >
                    View coverLetter
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
