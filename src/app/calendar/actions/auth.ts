"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (state: { error: string }, formData: FormData) => {
  const { email, password } = Object.fromEntries(formData.entries()) as {
    email: string;
    password: string;
  };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "이메일 또는 비밀번호가 틀렸습니다." };
  }

  const isValid = password === user.password;
  if (!isValid) {
    return { error: "이메일 또는 비밀번호가 틀렸습니다." };
  }

  const token = await signToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/calendar");
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/calendar");
};
