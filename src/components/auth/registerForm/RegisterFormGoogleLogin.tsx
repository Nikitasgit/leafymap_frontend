"use client";

import Skeleton from "@mui/material/Skeleton";
import { GoogleLogin, useGoogleOAuth } from "@react-oauth/google";

const GOOGLE_BUTTON_HEIGHT_PX = 40;

type RegisterFormGoogleLoginProps = {
  loginWithGoogle: (credential: string) => void;
  onGoogleFlowError: () => void;
  loadingAriaLabel: string;
};

/** À utiliser uniquement à l’intérieur de `GoogleOAuthProvider`. */
export function RegisterFormGoogleLogin({
  loginWithGoogle,
  onGoogleFlowError,
  loadingAriaLabel,
}: RegisterFormGoogleLoginProps) {
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  if (!scriptLoadedSuccessfully) {
    return (
      <div aria-busy={true} aria-label={loadingAriaLabel}>
        <Skeleton
          variant="rounded"
          height={GOOGLE_BUTTON_HEIGHT_PX}
          animation="wave"
          sx={{ width: "100%" }}
        />
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={(res) => {
        if (res.credential) {
          loginWithGoogle(res.credential);
        }
      }}
      onError={onGoogleFlowError}
      useOneTap={false}
      theme="outline"
      size="large"
      text="continue_with"
    />
  );
}
