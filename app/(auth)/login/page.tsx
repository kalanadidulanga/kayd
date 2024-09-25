"use client";

import { createUser, login } from "@/actions/user";
import { getSession, signIn } from "next-auth/react"; // Import getSession and signIn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for async actions

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading(true); // Set loading state to true during authentication

    // const res = await createUser();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false); // End loading

    if (res?.error) {
      // Set error message
      setError(res.error);

      // Optionally, use a toast notification
      toast({
        title: "Login Error",
        description: res.error,
        variant: "destructive",
      });
    } else {
      // Successful login, redirect to home
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="max-w-md w-full p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              className="block w-full mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              className="block w-full mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Page;
