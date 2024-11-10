"use client";
import Authentication from "@/components/authentication";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/portal/applications");
  }

  return <Authentication></Authentication>;
}
