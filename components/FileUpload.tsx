"use client";

import { InboxArrowDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    // only accept PDFS
    accept: { "application/pdf": [".pdf"] },
    // maximum number of files
    maxFiles: 1,
    // Whenever a file is uploaded or dropped onto the website...
    onDrop: (acceptedFile) => {
        console.log(acceptedFile);
        
    }
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      {/* Style input box -> */}
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex flex-col justify-center items-center",
        })}
      >
        <input {...getInputProps()} />
        <>
          {/* inox icon */}
          <InboxArrowDownIcon className="w-10 h-10 text-blue-500" />
          <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
        </>
      </div>
    </div>
  );
};
export default FileUpload;
