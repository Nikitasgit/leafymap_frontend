"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/store/userSlice";
import type { AppDispatch } from "@/store";

export default function UserInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return null;
}
