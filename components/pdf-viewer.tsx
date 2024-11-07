"use client";
import React from "react";

interface PDFViewerProps {
  path: string;
}

export default function PDFViewer({ path }: PDFViewerProps) {
  console.log("path", path);
  return <iframe src={path} width="95%" height="95%"></iframe>;
}
