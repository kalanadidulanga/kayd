"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/clients";
import { hash } from "bcryptjs";

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/", // Correct typo: "callBackUrl" -> "callbackUrl"
      email,
      password,
    });
  } catch (error) {
    return (error as Error).message;
  }
};

const createUser = async () => {
  let data = {
    name: "KayD",
    email: "dev.kalanadidulanga@gmail.com",
    password: await hash("ikgKD@2005", 10), // Usually hashed
    role: "admin",
    image: "https://files.kalanadidulanga.com/images/Avatar.png",
    authProviderId: "",
  };

  try {
    const user = await prisma.user.create({
      data: data,
    });
    // console.log(user);
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

export { login, createUser };
