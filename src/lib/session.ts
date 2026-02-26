import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
};
