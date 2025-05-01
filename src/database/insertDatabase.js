import mongoose from "mongoose";
import axios from "axios";
import {Journey, Station} from "./models/models.js";

async function fetchAndStoreStations(pageSize = 1000) {
    let startPage = 0;
    const authHeader = {
        Authorization: "Basic " + Buffer.from(`${process.env.SNCF_API_TOKEN}:`).toString("base64"),
    };
    let totalInserted = 0;

    while (true) {
        console.log(`Récupération gare, page ${startPage}...`);
        const url = `${process.env.SNCF_API_URL}/stop_areas?count=${pageSize}&start_page=${startPage}`;
        const res = await axios.get(url, {headers: authHeader});
        const stopAreas = res.data.stop_areas || [];
        if (stopAreas.length === 0) break;

        // Transformation des données
        const docs = stopAreas
            .filter(sa => sa?.name)
            .map(sa => ({
                updateOne: {
                    filter: {id_gare: sa.id},
                    update: {
                        id_gare: sa.id,
                        name: sa.name,
                        coord: {lat: sa.coord.lat, lon: sa.coord.lon},
                        timezone: sa.links?.find(l => l.type === "stop_area_timezone")?.id || null,
                    },
                    upsert: true,
                },
            }));

        if (docs.length) {
            const result = await Station.bulkWrite(docs);
            const inserted = result.upsertedCount + result.modifiedCount;
            totalInserted += inserted;
            console.log(`Page ${startPage} insérée/modifiée: ${inserted} gares`);
        }

        if (stopAreas.length < pageSize) break;
        startPage += 1;
    }

    console.log(`Terminé stations: ${totalInserted} gares traitées.`);
}

async function fetchAndStoreJourneys(pageSize = 1000) {
    let startPage = 0;
    const authHeader = {
        Authorization: "Basic " + Buffer.from(`${process.env.SNCF_API_TOKEN}:`).toString("base64"),
    };
    let totalInserted = 0;

    while (true) {
        console.log(`Récupération trajet, page ${startPage}...`);
        const url = `${process.env.SNCF_API_URL}/vehicle_journeys?count=${pageSize}&start_page=${startPage}`;
        const {data} = await axios.get(url, {headers: authHeader});
        const vjs = data.vehicle_journeys || [];
        if (vjs.length === 0) break;

        // Transformation des données
        const docs = vjs
            .map(vj => {
                const stopTimes = (vj.stop_times || []).map(sd => ({
                    drop_off_allowed: sd.drop_off_allowed,
                    pickup_allowed: sd.pickup_allowed,
                    skipped_stop: sd.skipped_stop,
                    stop_point: sd.stop_point.id,
                    utc_arrival_time: sd.utc_arrival_time,
                    utc_departure_time: sd.utc_departure_time,
                }));
                if (!stopTimes.length) return null;

                const cal = vj.calendars?.[0]?.week_pattern || {};
                return {
                    updateOne: {
                        filter: {id_vehicle_journey: vj.id},
                        update: {
                            id_vehicle_journey: vj.id,
                            stop_times: stopTimes,
                            departure: stopTimes[0].utc_departure_time,
                            arrival: stopTimes[stopTimes.length - 1].utc_arrival_time,
                            weekPattern: {
                                monday: cal.monday || false,
                                tuesday: cal.tuesday || false,
                                wednesday: cal.wednesday || false,
                                thursday: cal.thursday || false,
                                friday: cal.friday || false,
                                saturday: cal.saturday || false,
                                sunday: cal.sunday || false,
                            },
                        },
                        upsert: true,
                    },
                };
            })
            .filter(Boolean);

        if (docs.length) {
            const result = await Journey.bulkWrite(docs);
            const inserted = result.upsertedCount + result.modifiedCount;
            totalInserted += inserted;
            console.log(`Page ${startPage} insérée/modifiée: ${inserted} trajets`);
        }

        if (vjs.length < pageSize) break;
        startPage += 1;
    }

    console.log(`Terminé trajets: ${totalInserted} trajets traités.`);
}

async function run() {
    await mongoose.connect(process.env.DB_URL, {dbName: "traintran"});
    console.log("Connecté à TrainTran.");

    try {
        console.log("Suppression anciennes données...");
        await Station.deleteMany({});
        await Journey.deleteMany({});

        console.log("Démarrage import stations...");
        const startStations = Date.now();
        await fetchAndStoreStations();
        const endStations = Date.now();
        console.log(`Durée import stations: ${(endStations - startStations) / 1000} secondes.`);

        console.log("Démarrage import trajets...");
        const startJourneys = Date.now();
        await fetchAndStoreJourneys();
        const endJourneys = Date.now();
        console.log(`Durée import trajets: ${(endJourneys - startJourneys) / 1000} secondes.`);
    } catch (err) {
        console.error("Erreur lors de l'import:", err);
    } finally {
        await mongoose.connection.close();
        console.log("Connexion MongoDB fermée.");
    }
}

run();
