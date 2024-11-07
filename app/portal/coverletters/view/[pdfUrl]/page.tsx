import PDFViewer from "@/components/pdf-viewer";
import React from "react";

export default async function CoverLetterViewer({
  params,
}: {
  params: Promise<{ pdfUrl: string }>;
}) {
  const encodedUrl = (await params).pdfUrl;
  const url = decodeURIComponent(encodedUrl);

  return (
    <div className="w-full h-screen max-h-screen flex justify-center items-start">
      <PDFViewer path={url} />
    </div>
  );
}
