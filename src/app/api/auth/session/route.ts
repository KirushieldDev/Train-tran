import {NextResponse} from "next/server";
import {cookies, headers} from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@traintran/utils/dbConnect";
import {Account} from "@traintran/database/models/account";

const JWT_SECRET = process.env.JWT_SECRET!;
const STORAGE_COOKIE_AUTH = process.env.STORAGE_COOKIE_AUTH!;

export async function GET() {
    await dbConnect();

    // 1) On essaie d'abord le cookie
    const cookieStore = await cookies();
    let token = cookieStore.get(STORAGE_COOKIE_AUTH)?.value;
    // 2) Si pas de cookie, on regarde l'en-tête Authorization
    if (!token) {
        const hdrs = await headers();
        const auth = hdrs.get("authorization") || "";
        if (auth.startsWith("Bearer ")) {
            token = auth.slice(7);
        }
    }
    // 3) Si toujours pas de token, on renvoie user null
    if (!token) {
        return NextResponse.json({user: null});
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {sub?: string; email?: string};

        if (typeof payload.sub === "string" && typeof payload.email === "string") {
            const user = await Account.findById(payload.sub).select("firstName lastName gender mobile email").lean();
            if (user) {
                return NextResponse.json({user: {sub: payload.sub, ...user}});
            }
        }
    } catch {
        return NextResponse.json({user: null});
    }
    return NextResponse.json({user: null});
}
