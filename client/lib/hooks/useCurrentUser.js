"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};