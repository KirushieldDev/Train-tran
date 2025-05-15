import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Account} from "@traintran/database/models/account";

// GET – récupère le salt d’un utilisateur via son email
export async function GET(req: Request) {
    await dbConnect(); // connexion DB
    const {searchParams} = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({error: "Email manquant"}, {status: 400});
    const user = await Account.findOne({email}).select("salt").lean();
    if (!user) return NextResponse.json({error: "Identifiants invalides"}, {status: 401});
    return NextResponse.json({salt: user.salt});
}
