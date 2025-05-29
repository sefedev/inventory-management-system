"use client";
import { useCreateUserMutation } from "@/state/api";
import { GithubIcon, KeyIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  // const { data: session } = useSession();
  // const [createUser] = useCreateUserMutation();

  // useEffect(() => {
  //   // If session exists, create user in DB
  //   if (session?.user) {
  //     const userData = {
  //       name: session.user.name,
  //       email: session.user.email,
  //       image: session.user.image,
  //       emailVerified: new Date().toISOString(),
  //     };
  //     createUser(userData)
  //       .unwrap()
  //       .then((response) => {
  //         console.log(response, "User Created Successfully");
  //       })
  //       .catch((error) => {
  //         console.error("Error creating user:", error);
  //       });
  //   }
  // }, [session, createUser]);

  const handleCreateUser = async () => {
    await signIn("github", { redirectTo: "/dashboard" });
    // The page will redirect, and session will be updated on the next page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl text-center font-bold mb-10">
        Inventory Management Software
      </h1>
      <button
        onClick={handleCreateUser}
        className="flex items-center mt-8 justify-center gap-2 rounded-lg bg-gray-900 px-12 cursor-pointer py-3 text-white transition-colors hover:bg-gray-800 active:bg-gray-950"
      >
        <GithubIcon />
        <span>Sign in with GitHub</span>
      </button>
    </div>
  );
}