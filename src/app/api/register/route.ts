import {NextRequest, NextResponse} from "next/server";
import crypto from "crypto";
import {Account} from "@traintran/database/models/account";
import dbConnect from "@traintran/utils/dbConnect";
import {MongoError} from "mongodb";

type RegisterPayload = {
    lastName: string;
    firstName: string;
    gender: string;
    mobile: string;
    email: string;
    salt: string;
    hash: string;
};

export async function POST(req: NextRequest) {
    await dbConnect();
    const payload: RegisterPayload = await req.json();

    const {lastName, firstName, gender, mobile, email, salt, hash} = payload;
    if (!lastName || !firstName || !gender || !mobile || !email || !salt || !hash) {
        return NextResponse.json({error: "Champs manquants"}, {status: 400});
    }

    try {
        await Account.create({lastName, firstName, gender, mobile, email, salt, hash});
    } catch (error: unknown) {
        if (error instanceof MongoError && error.code === 11000) {
            return NextResponse.json({error: "Email déjà utilisé"}, {status: 409});
        }
        const message = error instanceof Error ? error.message : "Erreur serveur";
        return NextResponse.json({error: message}, {status: 500});
    }

    return NextResponse.redirect(new URL("/", req.url));
}
