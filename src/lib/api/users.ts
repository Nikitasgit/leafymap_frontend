import axios from "axios";
import { jwtVerify } from "jose";

export interface IDecodedToken {
  id: string;
  userType: string;
  iat: number;
  exp: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const origin =
  process.env.NODE_ENV === "production"
    ? "https://spotlight-project.vercel.app"
    : "http://localhost:3000";

export const getUserById = async (userId: string) => {
  try {
    const url = `${API_URL}/api/users/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
      },
    });

    return response.data.data.user;
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erreur lors du chargement de l'utilisateur";
    return errorMessage;
  }
};

export async function verifyJWT(token: string): Promise<IDecodedToken | null> {
  try {
    console.log("token", token);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);
    console.log("payload", payload);

    if (
      typeof payload.id === "string" &&
      typeof payload.userType === "string"
    ) {
      return {
        id: payload.id,
        userType: payload.userType,
        iat: payload.iat || 0,
        exp: payload.exp || 0,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function getTokenFromCookies(cookieHeader: string): string | null {
  try {
    const cookies = cookieHeader.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token") {
        return value;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export const getCurrentUser = async (cookieHeader?: string) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Origin: origin,
    };
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers,
      credentials: cookieHeader ? undefined : "include",
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.data?.user || null;
  } catch {
    return null;
  }
};
