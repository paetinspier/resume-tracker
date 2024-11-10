"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-8">
      <Card className="">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={"destructive"} onClick={() => handleLogout()}>
            Logout
          </Button>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
