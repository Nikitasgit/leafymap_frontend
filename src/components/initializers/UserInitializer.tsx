"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchUser, selectUser } from "@/store/userSlice";
import { useAppDispatch } from "@/store";

export default function UserInitializer() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useSelector(selectUser);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  useEffect(() => {
    const isLoggedIn = document.cookie.includes("logged_in=true");
    if (isLoggedIn && !user && !loading && error === "" && retryCount === 0) {
      dispatch(fetchUser());
    }

    if (!user && error !== "" && !loading && retryCount < maxRetries) {
      const retryTimeout = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        dispatch(fetchUser());
      }, 10000);

      return () => clearTimeout(retryTimeout);
    }
  }, [user, loading, error, retryCount, dispatch]);

  return null;
}
