"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logoutUser } from "@/lib/api/auth.api";

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,

        onSuccess: (response) => {


            queryClient.removeQueries({
                queryKey: ["currentUser"],
            });

            toast.success(
                response?.message || "Logged out successfully."
            );
            setTimeout(() => {
                router.replace("/auth/login");
            }, 500);

            window.location.href = "/auth/login";
        },

        onError: (error) => {
            const message =
                error?.response?.data?.message ||
                "Logout failed. Please try again.";

            toast.error(message);
        },
    });
};