"use client";
import { useCreateUserMutation } from "@/state/api";
import { KeyIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [createUser] = useCreateUserMutation()

  const handleCreateUser = async (userData) => {
   const result = await signIn("github", { redirectTo: "/dashboard" })
    
   if(result?.error) {
    console.error("Error signing in:", result.error)
    return;
   }

   const { data: updatedSession } = await useSession();

   if(updatedSession?.user) {
    const userData = {
      name: updatedSession.user.name,
      email: updatedSession.user.email,
      image: updatedSession.user.image,
      emailVerified: new Date().toISOString()
    }
    try {
      const response = await createUser(userData).unwrap()
      console.log(response, "User Created Succesfully")
    } catch (error) {
      console.error("Error creating user:", error)
    }
   } else {
    console.error("session Data is not available after sign-in")
   }
  }

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl text-center font-bold mb-10">
        Inventory Management Software
      </h1>
      <form className="bg-white p-6 rounded shadow-md w-80">
        <div className="mb-4">
          <h2 className="text-2xl text-center font-bold mb-6">Sign In</h2>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Sign In
        </button>
      </form>

      <button
        onClick={handleCreateUser}
        className="flex items-center mt-8 justify-center gap-2 rounded-lg bg-gray-900 px-12 cursor-pointer py-3 text-white transition-colors hover:bg-gray-800 active:bg-gray-950"
      >
        <KeyIcon />
        <span>Sign in with GitHub</span>
      </button>
    </div>
  );
}
