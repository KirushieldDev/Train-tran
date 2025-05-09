import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Account} from "@traintran/database/models/account";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const STORAGE_COOKIE_AUTH = process.env.STORAGE_COOKIE_AUTH as string;

export async function POST(req: Request) {
    await dbConnect();
    const {email, hash, remember} = (await req.json()) as {email: string; hash: string; remember?: boolean};
    if (!email || !hash) {
        return NextResponse.json({error: "Champs manquants"}, {status: 400});
    }
    const user = await Account.findOne({email}).lean();
    if (!user || user.hash !== hash) {
        return NextResponse.json({error: "Identifiants invalides"}, {status: 401});
    }
    await Account.updateOne({email}, {$set: {lastLogin: new Date()}});
    const token = jwt.sign({sub: user._id, email: user.email}, JWT_SECRET, {expiresIn: "30m"});
    const res = NextResponse.json({success: true, token});
    if (remember) {
        const cookieOpts = {
            name: STORAGE_COOKIE_AUTH,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        };
        res.cookies.set(cookieOpts);
    }
    return res;
}
