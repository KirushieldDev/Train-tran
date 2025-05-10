import {NextResponse} from "next/server";

const STORAGE_COOKIE_AUTH = process.env.NEXT_PUBLIC_STORAGE_COOKIE_AUTH!;

export async function POST() {
    const res = NextResponse.json({success: true});
    // Supprime le cookie en le réinitialisant avec maxAge 0
    res.cookies.set({
        name: STORAGE_COOKIE_AUTH,
        value: "",
        path: "/",
        maxAge: 0,
    });
    return res;
}
