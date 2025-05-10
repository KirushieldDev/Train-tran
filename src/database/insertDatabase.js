import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import axios from "axios";
import {Journey, Station} from "./models/models.js";

/*
 * Ce script permet de récupérer les gares TGV depuis l'API SNCF
 */
async function fetchTGVStationIds() {
    const authHeader = { Authorization: "Basic " + Buffer.from(`${process.env.SNCF_API_TOKEN}:`).toString("base64") };
    const tgvIds = new Set();
    let page = 0;

    while (true) {
        const url = `${process.env.SNCF_API_URL}/physical_modes/physical_mode:LongDistanceTrain/stop_areas?count=1000&start_page=${page}`;
        const { data } = await axios.get(url, { headers: authHeader });
        const sas = data.stop_areas || [];
        if (!sas.length) break;

        sas.forEach(sa => tgvIds.add(sa.id.split(':')[2])); // On ne garde que l'ID de numérique de la gare

        if (sas.length < 1000) break;
        page++;
    }

    console.log(`Identifiées ${tgvIds.size} gares grande vitesse.`);
    return tgvIds;
}

/*
 * Ce script permet de récupérer les détails des gares SNCF depuis l'API SNCF
 */
async function fetchAndStoreStations(pageSize = 1000, tgvIds) {
    let startPage = 0;
    const authHeader = {
        Authorization: "Basic " + Buffer.from(`${process.env.SNCF_API_TOKEN}:`).toString("base64"),
    };
    let totalInserted = 0;

    while (true) {
        console.log(`Récupération gare, page ${startPage}...`);
        const url = `${process.env.SNCF_API_URL}/physical_modes/physical_mode%3ALongDistanceTrain/stop_areas?count=${pageSize}&start_page=${startPage}`;
        const res = await axios.get(url, {headers: authHeader});
        const stopAreas = res.data.stop_areas || [];
        if (stopAreas.length === 0) break;

        // Transformation des données
        const docs = stopAreas
            .filter(sa => {
                // on extrait l'ID numérique « 80153452 » depuis « stop_area:SNCF:80153452 »
                const areaIdNum = sa.id.split(':')[2];
                return tgvIds.has(areaIdNum) && sa.name;
            })
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

        // Si on a des données à insérer
        if (docs.length) {
            const result = await Station.bulkWrite(docs);
            const inserted = result.upsertedCount + result.modifiedCount;
            totalInserted += inserted;
            console.log(`Page ${startPage} insérée/modifiée: ${inserted} gares`);
        }

        // Si on a dépassé la page voulue
        if (stopAreas.length < pageSize) break;
        startPage += 1;
    }

    console.log(`Terminé stations: ${totalInserted} gares traitées.`);
}

/*
 * Ce script permet de récupérer les trajets TGV depuis l'API SNCF
 */
async function fetchAndStoreJourneys(pageSize = 1000, tgvIds) {
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

                // Filtrer les trajets qui ne passent pas par les gares TGV
                const departureStopPoint = stopTimes[0].stop_point;
                const departureIdNumber = departureStopPoint.split(':')[2];
                if (!tgvIds.has(departureIdNumber)) return null;

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

        // Si on a des données à insérer
        if (docs.length) {
            const result = await Journey.bulkWrite(docs);
            const inserted = result.upsertedCount + result.modifiedCount;
            totalInserted += inserted;
            console.log(`Page ${startPage} insérée/modifiée: ${inserted} trajets`);
        }

        // Si on a dépassé la page voulue
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

        // Récupération des gares TGV
        const tgvIds = await fetchTGVStationIds();

        console.log("Démarrage import stations...");
        const startStations = Date.now();
        await fetchAndStoreStations(1000, tgvIds);
        const endStations = Date.now();
        console.log(`Durée import stations: ${(endStations - startStations) / 1000} secondes.`);

        console.log("Démarrage import trajets...");
        const startJourneys = Date.now();
        await fetchAndStoreJourneys(1000, tgvIds);
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
