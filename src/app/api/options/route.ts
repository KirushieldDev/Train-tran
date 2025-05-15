import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Option} from "@traintran/database/models/options";

export async function GET() {
    try {
        // Connexion à MongoDB
        await dbConnect();

        // Récupération de toutes les options (même inactives pour pouvoir les filtrer côté client si besoin)
        const options = await Option.find({}).lean();

        // Retourner les options au format JSON
        return NextResponse.json(options);
    } catch (error) {
        console.error("Erreur lors de la récupération des options:", error);
        return NextResponse.json({error: "Erreur lors de la récupération des options"}, {status: 500});
    }
}
