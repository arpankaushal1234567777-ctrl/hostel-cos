import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET is not set.");
  }
  return secret;
};

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

export const signToken = async (payload: TokenPayload) => {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const alg = "HS256";

    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("8h") // 8 hours
      .sign(secret);
  } catch (error) {
    throw new Error("Your token has not been signed.");
  }
};

export const verifyToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
};

export const removeTokenCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  });
};
