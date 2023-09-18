import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // if userID is present, then we can say auth has been completed
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    // bg gradient created with https://hypercolor.dev
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      {/* Center everything */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">
              Chat with Your Documents !
            </h1>
            {/* User button from clerk only shows when user is signed in */}
            <UserButton />
          </div>
          <div className="mt-2">
            {/* If user is authenticated, let user navigate to chats */}
            {isAuth && <Button>Go to Chat</Button>}
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">Join *million of NPCs around the world to quickly understand documents with the power of AI!</p>
          {/* This is the file upload section. Only if user is authenticated */}
          <div className="mt-4 w-full">
            {
              isAuth ? (
                <FileUpload />
              ): (
                <Link href={"/sign-in"}>
                <Button>
                  Log In to Get Started
                  <ArrowRightOnRectangleIcon className="h-4 w-4 ml-2" />
                </Button>
                </Link>

              )
            }

          </div>
        </div>
      </div>
    </div>
  );
}
