import {NextResponse} from "next/server";

const COOKIE_NAME = process.env.COOKIE_NAME!;

export async function POST() {
    const res = NextResponse.json({ success: true });
    // Supprime le cookie en le réinitialisant avec maxAge 0
    res.cookies.set({
        name: COOKIE_NAME,
        value: "",
        path: "/",
        maxAge: 0,
    });
    return res;
}