"use client"; // Ensure this component is a client-side component

import { signOut } from "next-auth/react"; // Use the correct signOut from next-auth/react
import { Button } from "@/components/ui/button";
import React from "react";

const DashBoard = () => {
  return (
    <div className="p-10 flex gap-8 items-center">
      <h1>DashBoard</h1>
      <Button
        onClick={() => {
          signOut(); // Optional: Redirect to login page after sign out
        }}
      >
        SignOut
      </Button>
    </div>
  );
};

export default DashBoard;
