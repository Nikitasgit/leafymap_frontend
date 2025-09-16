import axios from "axios";

interface VerifyTokenResponse {
  message: string;
  data?: {
    user: {
      id: string;
      userType: string;
      username: string;
      email: string;
    };
  };
}

export const verifyTokenServer = async (
  token: string
): Promise<{
  isValid: boolean;
  user?: VerifyTokenResponse["data"];
}> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return { isValid: false };
    }

    const response = await axios.get<VerifyTokenResponse>(
      `${apiUrl}/api/auth/verify`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      }
    );

    const isValid = !!response.data.data;

    return {
      isValid,
      user: response.data.data || undefined,
    };
  } catch (error) {
    console.error("Token verification failed:", error);

    // Log more details in development
    if (process.env.NODE_ENV === "development") {
      console.error("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.error("Token:", token ? "Present" : "Missing");
    }

    return {
      isValid: false,
    };
  }
};
