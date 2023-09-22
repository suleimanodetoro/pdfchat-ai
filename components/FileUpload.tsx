"use client";

import { uploadToS3 } from "@/lib/s3";
import { ArrowPathIcon, InboxArrowDownIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState<boolean>(false);
  // mutation to create a chat room
  const { mutate, isLoading } = useMutation({
    // will take a mutation function
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    // only accept PDFS
    accept: { "application/pdf": [".pdf"] },
    // maximum number of files
    maxFiles: 1,
    // Whenever a file is uploaded or dropped onto the website...
    // make function async because we are using await
    onDrop: async (acceptedFile) => {
      console.log(acceptedFile);
      const file = acceptedFile[0];
      // if file is bigger than 10MB, do not upload lmao
      if (file.size > 10 * 1024 * 1024) {
        toast.error("please upload a file 10MB or less");
        return;
      }
      // if not greater than 10MB, upload to S3
      try {
        setUploading(true);
        const data = await uploadToS3(file);
        console.log("data ", data);
        // after uploading to s3, store in db
        if (!data?.file_key || !data?.file_name) {
          toast.error("Cant send to api, something went wrong");
          return;
        }
        // data has the structure of {file_name, file_key} so its all good to pass like this
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            // on success, the mutation will have access to chat_id we returned in route code
            toast.success("Chat has been created");
            // redirect to chat page with chat id
            router.push(`/chat/${chat_id}`);
          },
          onError(error) {
            toast.error("Error creating chat in server");
            console.log(error);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
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
        {/* If mutate function is in loading state, show animation */}
        {isLoading || uploading ? (
          <>
            {/* Loading state */}
            <ArrowPathIcon className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Spilling tea to GPT</p>
          </>
        ) : (
          <>
            {/* show inbox icon */}
            <InboxArrowDownIcon className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};
export default FileUpload;
