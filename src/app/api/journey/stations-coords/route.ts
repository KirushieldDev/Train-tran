import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Station} from "@traintran/database/models/models";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    // On récupère les paramètres de la requête
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Si les paramètres 'from' et 'to' ne sont pas fournis, on renvoie une erreur 400
    if (!from || !to) {
        return NextResponse.json({message: "Paramètres 'from' et 'to' requis"}, {status: 400});
    }
    // On se connecte à la base de données
    await dbConnect();

    try {
        // On cherche les gares dans la base de données
        const [gareFrom, gareTo] = await Promise.all([
            Station.findOne({name: {$regex: `^${from}$`, $options: "i"}})
                .select("coord.lat coord.lon -_id")
                .lean(),
            Station.findOne({name: {$regex: `^${to}$`, $options: "i"}})
                .select("coord.lat coord.lon -_id")
                .lean(),
        ]);
        // Si une des gares n'est pas trouvée, on renvoie une erreur 404
        if (!gareFrom || !gareTo || !gareFrom.coord || !gareTo.coord) {
            return NextResponse.json({message: "Au moins une des gares est introuvable"}, {status: 404});
        }
        // On récupère les coordonnées des gares
        const result = {
            from: {lat: gareFrom.coord.lat, lon: gareFrom.coord.lon},
            to: {lat: gareTo.coord.lat, lon: gareTo.coord.lon},
        };
        // On renvoie les coordonnées des gares en JSON
        return NextResponse.json(result);
    } catch (error) {
        console.error("Erreur /api/journey/stations-coords", error);
        return NextResponse.json({message: "Erreur serveur"}, {status: 500});
    }
}
