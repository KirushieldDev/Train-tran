import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Station} from "@traintran/database/models/models";

export async function GET() {
    try {
        await dbConnect();
        const docs = await Station.find().select("name -_id").lean();
        const names = docs.map(s => s.name);
        return NextResponse.json(names);
    } catch (error) {
        console.error("Erreur /api/journey/stations-name", error);
        return NextResponse.json({message: "Erreur serveur lors du chargement des gares"}, {status: 500});
    }
}
