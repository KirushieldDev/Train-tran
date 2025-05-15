import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Account} from "@traintran/database/models/account";
import jwt from "jsonwebtoken";

// Récupération des variables d'environnement pour le secret JWT et le nom du cookie
const JWT_SECRET = process.env.JWT_SECRET as string;
const STORAGE_COOKIE_AUTH = process.env.NEXT_PUBLIC_STORAGE_COOKIE_AUTH as string;

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

    // Mise à jour de la date de dernière connexion
    await Account.updateOne({email}, {$set: {lastLogin: new Date()}});

    // Génération d'un token JWT avec une expiration de 7 jours
    const token = jwt.sign({sub: user._id, email: user.email}, JWT_SECRET, {expiresIn: "7d"});

    const res = NextResponse.json({success: true, token});

    if (remember) {
        // Configuration du cookie pour "se souvenir de moi"
        const cookieOpts = {
            name: STORAGE_COOKIE_AUTH,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 jours
        };
        res.cookies.set(cookieOpts);
    }
    return res;
}
