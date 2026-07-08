"use client";

import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateButtonWidth = () => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;

      if (width > 0) {
        setButtonWidth(Math.floor(width));
      }
    };

    updateButtonWidth();

    if (!containerRef.current || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateButtonWidth);
      return () => window.removeEventListener("resize", updateButtonWidth);
    }

    const observer = new ResizeObserver(updateButtonWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {!scriptLoadedSuccessfully || !buttonWidth ? (
        <div aria-busy={true} aria-label={loadingAriaLabel}>
          <Skeleton
            variant="rounded"
            height={GOOGLE_BUTTON_HEIGHT_PX}
            animation="wave"
            sx={{ width: "100%" }}
          />
        </div>
      ) : (
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
          width={buttonWidth}
        />
      )}
    </div>
  );
}
