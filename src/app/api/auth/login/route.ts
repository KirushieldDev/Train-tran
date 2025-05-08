import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Account} from "@traintran/database/models/account";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_NAME = process.env.COOKIE_NAME as string;

export async function POST(req: Request) {
    await dbConnect();
    const {email, hash} = (await req.json()) as {email: string; hash: string};
    if (!email || !hash) {
        return NextResponse.json({error: "Champs manquants"}, {status: 400});
    }
    const user = await Account.findOne({email}).lean();
    if (!user || user.hash !== hash) {
        return NextResponse.json({error: "Identifiants invalides"}, {status: 401});
    }
    await Account.updateOne({email}, {$set: {lastLogin: new Date()}});
    const token = jwt.sign({sub: user._id, email: user.email}, JWT_SECRET, {expiresIn: "30m"});
    const res = NextResponse.json({success: true});
    res.cookies.set({name: COOKIE_NAME, value: token, httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7});
    return res;
}
