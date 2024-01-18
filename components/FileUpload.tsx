"use client";

import React from "react";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface Props {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

const FileUpload = ({ value, onChange, endpoint }: Props) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image className="object-cover rounded-full" src={value} fill alt="" />

        <button
          className="bg-rose-500 absolute top-0 right-0 text-white p-1 shadow-sm rounded-full"
          onClick={() => onChange("")}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative bg-background/10 flex items-center p-2 mt-2 rounded-md">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />

        <a
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          href={value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>

        <button
          className="bg-rose-500 absolute -top-2 -right-2 text-white p-1 rounded-full shadow-sm"
          onClick={() => onChange("")}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
