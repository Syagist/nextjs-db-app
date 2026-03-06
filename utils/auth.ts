import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { User } from "@prisma/client";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export const setRefreshToken = async (user: User) => {
  const refreshToken = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const getAccessToken = async (user: User) => {
  const accessToken = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret);
  return accessToken;
};
