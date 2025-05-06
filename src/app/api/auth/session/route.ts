import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@traintran/utils/dbConnect";
import {Account} from "@traintran/database/models/account";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = process.env.COOKIE_NAME!;

export async function GET() {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({user: null});

    try {
        const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {sub?: string; email?: string};

        if (typeof payload.sub === "string" && typeof payload.email === "string") {
            const user = await Account.findById(payload.sub).select("email").lean();
            if (user) {
                return NextResponse.json({user: {sub: payload.sub, email: user.email}});
            }
        }
    } catch {}
    return NextResponse.json({user: null});
}
