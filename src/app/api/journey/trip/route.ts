import {NextResponse} from "next/server";
import dbConnect from "@traintran/utils/dbConnect";
import {Station, Journey} from "@traintran/database/models/models";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const fromName = searchParams.get("from");
    const toName = searchParams.get("to");

    if (!fromName || !toName) {
        return NextResponse.json({message: "Paramètres 'from' et 'to' requis"}, {status: 400});
    }

    await dbConnect(); // connexion DB

    try {
        // 1) Récupère id_gare pour les stations de départ et de destination
        const [gareFrom, gareTo] = await Promise.all([
            Station.findOne({name: {$regex: `^${fromName}$`, $options: "i"}})
                .select("id_gare")
                .lean(),
            Station.findOne({name: {$regex: `^${toName}$`, $options: "i"}})
                .select("id_gare")
                .lean(),
        ]);

        if (!gareFrom || !gareTo) {
            return NextResponse.json({message: "Au moins une des gares est introuvable"}, {status: 404});
        }

        // 2) Construire les stop_point IDs à partir de id_gare
        const buildStopPoint = (idGare: string) => {
            const code = idGare.split(":").pop();
            return `stop_point:SNCF:${code}:Train`;
        };

        const fromStopPoint = buildStopPoint(gareFrom.id_gare);
        const toStopPoint = buildStopPoint(gareTo.id_gare);

        // 3) Agrégation pour récupérer les identifiants des trajets entre la gare de départ et la gare d'arrivée
        const journeys = await Journey.aggregate([
            {$match: {"stop_times.stop_point": {$all: [fromStopPoint, toStopPoint]}}},
            {
                $addFields: {
                    fromIndex: {$indexOfArray: ["$stop_times.stop_point", fromStopPoint]},
                    toIndex: {$indexOfArray: ["$stop_times.stop_point", toStopPoint]},
                },
            },
            {$match: {$expr: {$lt: ["$fromIndex", "$toIndex"]}}},
            {
                $project: {
                    _id: 0,
                    id_vehicle_journey: 1,
                    // Extraire le jour de id_vehicle_journey
                    day: {$arrayElemAt: [{$split: ["$id_vehicle_journey", ":"]}, 2]},
                    departure: 1,
                    arrival: 1,
                    fromIndex: 1,
                    toIndex: 1,
                    stop_times: 1,
                    weekPattern: 1,
                },
            },
        ]);

        return NextResponse.json(
            {
                from: gareFrom.id_gare,
                to: gareTo.id_gare,
                journeys,
            },
            {status: 200},
        );
    } catch (error) {
        console.error("Error /api/journey/trip", error);
        return NextResponse.json({message: "Error server"}, {status: 500});
    }
}
