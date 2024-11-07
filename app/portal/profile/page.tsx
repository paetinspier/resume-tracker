"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-screen h-screen felx justify-center items-center">
      <Button variant={"destructive"} onClick={() => handleLogout()}>
        Logout
      </Button>
    </div>
  );
}
