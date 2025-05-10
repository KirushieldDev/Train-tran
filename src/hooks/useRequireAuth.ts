"use client";
import {useEffect} from "react";
import {useAuth} from "@traintran/context/AuthContext";
import {useRouter} from "next/navigation";

export function useRequireAuth() {
    const {user, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);
}
