import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Station} from "@traintran/database/models/models";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
        return NextResponse.json({message: "Paramètres 'from' et 'to' requis"}, {status: 400});
    }

    await dbConnect();

    try {
        const [gareFrom, gareTo] = await Promise.all([
            Station.findOne({name: {$regex: `^${from}$`, $options: "i"}})
                .select("coord.lat coord.lon -_id")
                .lean(),
            Station.findOne({name: {$regex: `^${to}$`, $options: "i"}})
                .select("coord.lat coord.lon -_id")
                .lean(),
        ]);

        if (!gareFrom || !gareTo) {
            return NextResponse.json({message: "Au moins une des gares est introuvable"}, {status: 404});
        }

        const result = {
            from: {lat: gareFrom.coord.lat, lon: gareFrom.coord.lon},
            to: {lat: gareTo.coord.lat, lon: gareTo.coord.lon},
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erreur /api/stations", error);
        return NextResponse.json({message: "Erreur serveur"}, {status: 500});
    }
}
