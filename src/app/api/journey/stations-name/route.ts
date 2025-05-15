import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Station} from "@traintran/database/models/models";

// GET – retourne la liste des noms de gares
export async function GET() {
    try {
        await dbConnect(); // connexion DB
        const docs = await Station.find().select("name -_id").lean(); // récupération noms uniquement
        const names = docs.map(s => s.name); // extraction des noms
        return NextResponse.json(names);
    } catch (error) {
        console.error("Erreur /api/journey/stations-name", error);
        return NextResponse.json({message: "Erreur serveur lors du chargement des gares"}, {status: 500});
    }
}
