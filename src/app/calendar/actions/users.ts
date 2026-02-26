"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const getUsers = async () => {
  const session = await getSession();
  if (!session) return [];

  return await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });
};
