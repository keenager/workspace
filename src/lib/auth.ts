import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

//JWT 발급
export const signToken = async (user: SessionUser) => {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7D")
    .sign(secret);
};

//JWT 검증
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
};
