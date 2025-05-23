"use client";

import { useEffect } from "react";
import useAuthUtils from "@/hooks/useAuthUtils";

const AuthInitializer = () => {
  const { getUserDetails } = useAuthUtils();

  useEffect(() => {
    getUserDetails();
  });

  return null;
};

export default AuthInitializer;
