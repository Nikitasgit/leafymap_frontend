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
    const response = await axios.get<VerifyTokenResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
        withCredentials: true,
      }
    );

    const isValid = !!response.data.data;

    return {
      isValid,
      user: response.data.data || undefined,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return {
      isValid: false,
    };
  }
};
