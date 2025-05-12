import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import axios from "axios";
import {Journey as JourneyModel, Station} from "./models/models.js";

/**
 * Représente un trajet SNCF pour déduplication en mémoire
 */
class Journey {
    constructor(vj) {
        this.id = vj.id;
        this.headsign = vj.headsign;
        this.stop_times = (vj.stop_times || []).map(sd => ({
            drop_off_allowed: sd.drop_off_allowed,
            pickup_allowed: sd.pickup_allowed,
            skipped_stop: sd.skipped_stop,
            stop_point: sd.stop_point.id,
            utc_arrival_time: sd.utc_arrival_time,
            utc_departure_time: sd.utc_departure_time,
        }));
        const cal = vj.calendars?.[0]?.week_pattern || {};
        this.weekPattern = {
            monday: cal.monday || false,
            tuesday: cal.tuesday || false,
            wednesday: cal.wednesday || false,
            thursday: cal.thursday || false,
            friday: cal.friday || false,
            saturday: cal.saturday || false,
            sunday: cal.sunday || false,
        };
    }

    /**
     * Clé de déduplication basée sur stop_times + weekPattern
     */
    get key() {
        return JSON.stringify({ stop_times: this.stop_times, weekPattern: this.weekPattern });
    }
}

/*
 * Ce script permet de récupérer les gares TGV & TER depuis l'API SNCF
 */
async function fetchTGVandTERStationIds() {
    const authHeader = {Authorization: "Basic " + Buffer.from(`${process.env.SNCF_API_TOKEN}:`).toString("base64")};
    const stationsIds = new Set();
    let page = 0;

    // On récupère d'abord les gares TGV
    while (true) {
        const url = `${process.env.SNCF_API_URL}/physical_modes/physical_mode:LongDistanceTrain/stop_areas?count=1000&start_page=${page}`;
        const {data} = await axios.get(url, {headers: authHeader});
        const sas = data.stop_areas || [];
        if (!sas.length) break;

        sas.forEach(sa => stationsIds.add(sa.id.split(":")[2])); // On ne garde que l'ID de numérique de la gare

        if (sas.length < 1000) break;
        page++;
    }

    // Puis les gares TER
    while (true) {
        const url = `${process.env.SNCF_API_URL}/physical_modes/physical_mode:Train/stop_areas?count=1000&start_page=${page}`;
        const {data} = await axios.get(url, {headers: authHeader});
        const sas = data.stop_areas || [];
        if (!sas.length) break;

        sas.forEach(sa => stationsIds.add(sa.id.split(":")[2])); // On ne garde que l'ID de numérique de la gare

        if (sas.length < 1000) break;
        page++;
    }

    console.log(`Identifiées ${stationsIds.size} gares.`);
    return stationsIds;
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
        const url = `${process.env.SNCF_API_URL}/stop_areas?count=${pageSize}&start_page=${startPage}`;
        const res = await axios.get(url, {headers: authHeader});
        const stopAreas = res.data.stop_areas || [];
        if (stopAreas.length === 0) break;

        // Transformation des données
        const docs = stopAreas
            .filter(sa => {
                // on extrait l'ID numérique "80153452" depuis "stop_area:SNCF:80153452"
                const areaIdNum = sa.id.split(":")[2];
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
export async function fetchAndStoreJourneys(pageSize = 1000, tgvIds) {
    let startPage = 0;
    const authHeader = {
        Authorization: "Basic " + Buffer.from(`${process.env.SNCF_API_TOKEN}:`).toString("base64"),
    };
    let totalInserted = 0;

    // Map<key, Journey> pour déduplication globale
    const journeysMap = new Map();

    // Pagination API
    while (true) {
        console.log(`Récupération trajet, page ${startPage}...`);
        const url = `${process.env.SNCF_API_URL}/vehicle_journeys?count=${pageSize}&start_page=${startPage}`;
        const { data } = await axios.get(url, { headers: authHeader });
        const vjs = data.vehicle_journeys || [];
        if (!vjs.length) break;

        // Liste des journeys à insérer au prochain bulk
        const pageJourneys = [];

        for (const vj of vjs) {
            const dto = new Journey(vj);
            const dep = dto.stop_times[0]?.stop_point;
            const depNum = dep?.split(":")[2];
            if (!depNum || !tgvIds.has(depNum)) continue;

            // Si jamais clé non vue, on la marque
            if (!journeysMap.has(dto.key)) {
                journeysMap.set(dto.key, dto);
                pageJourneys.push(dto);
            }
        }

        // bulkWrite pour la page courante si on a de nouveaux trajets
        if (pageJourneys.length) {
            const bulkOps = pageJourneys.map(dto => ({
                updateOne: {
                    filter: { id_vehicle_journey: dto.id },
                    update: {
                        id_vehicle_journey: dto.id,
                        headsign: dto.headsign,
                        stop_times: dto.stop_times,
                        departure: dto.stop_times[0].utc_departure_time,
                        arrival: dto.stop_times[dto.stop_times.length - 1].utc_arrival_time,
                        weekPattern: dto.weekPattern,
                    },
                    upsert: true,
                }
            }));

            const result = await JourneyModel.bulkWrite(bulkOps);
            const count = (result.upsertedCount || 0) + (result.modifiedCount || 0);
            totalInserted += count;
            console.log(`Page ${startPage}: ${count} trajets insérés/modifiés`);
        } else {
            console.log(`Page ${startPage}: aucun nouveau trajet à insérer`);
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
        await JourneyModel.deleteMany({});

        // Récupération des gares TGV
        const tgvIds = await fetchTGVandTERStationIds();

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
