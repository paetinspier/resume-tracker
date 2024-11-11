"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/AuthContext";
import { getJobApplicationById } from "@/lib/firebase/firestore";
import { JobApplication } from "@/lib/firebase/models";
import {
  CreditCard,
  FileBadge,
  Keyboard,
  PartyPopper,
  Pencil,
  Send,
  Settings,
  User,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ApplicationPage() {
  const params = useParams<{ appId: string }>();
  const [application, setApplication] = useState<JobApplication>();
  const { user } = useAuth();
  const [showFullDescription, setShowFullDescription] = useState();

  useEffect(() => {
    async function fetchApp() {
      console.log("fetching application");
      try {
        if (!user) {
          setApplication(undefined);
          return;
        }
        const res = await getJobApplicationById(user.uid, params.appId);
        if (!res) {
          setApplication(undefined);
        } else {
          setApplication(res);
        }
      } catch (err) {
        console.log(err);
        setApplication(undefined);
      }
    }

    if (user && user.uid && params.appId) {
      fetchApp();
    }
  }, [params, user]);

  return (
    <div className="w-full h-full flex justify-start items-start p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="w-full flex flex-row justify-between items-center">
              <CardTitle>{application?.companyName}</CardTitle>
              <Badge>{application?.status}</Badge>
            </div>
            <div className="flex flex-row justify-start items-center gap-4">
              <CardDescription>Job Title</CardDescription>
              <Button variant="ghost">
                <Pencil size={8} />
              </Button>
            </div>
            <CardContent>{application?.jobTitle}</CardContent>
            <div className="flex flex-row justify-start items-center gap-4">
              <CardDescription>Job Description</CardDescription>
              <Button variant="ghost">
                <Pencil size={8} />
              </Button>
            </div>
            <CardContent>
              {showFullDescription
                ? application?.jobDescription
                : application?.jobDescription.substring(0, 250) + "..."}
            </CardContent>

            <CardDescription>Application Status</CardDescription>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-56" variant="outline">
                  {application?.status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Send />
                    Applied
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User />
                    Interviewing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <X />
                    Rejected
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileBadge />
                    Offered
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PartyPopper />
                    Accepted
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
