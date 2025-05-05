import {NextResponse} from "next/server";
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

export async function POST(req: Request) {
    await dbConnect();
    const {firstName, lastName, gender, mobile, email, salt, hash} = (await req.json()) as RegisterPayload;
    if (!firstName || !lastName || !gender || !mobile || !email || !salt || !hash) {
        console.error("Champs manquants", firstName, lastName, gender, mobile, email, salt, hash);
        return NextResponse.json({error: "Champs manquants"}, {status: 400});
    }
    try {
        await Account.create({firstName, lastName, gender, mobile, email, salt, hash});
        return NextResponse.json({success: true}, {status: 201});
    } catch (error: unknown) {
        if (error instanceof MongoError && error.code === 11000) {
            return NextResponse.json({error: "Email déjà utilisé"}, {status: 409});
        }
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}
