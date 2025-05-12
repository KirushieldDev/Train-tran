import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
    {
        id_gare: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        coord: {
            lat: {type: Number, required: true},
            lon: {type: Number, required: true},
        },
        timezone: {type: String},
    },
    {timestamps: true},
);

const stopTimeSchema = new mongoose.Schema({
    drop_off_allowed: {type: Boolean, required: true}, // autorise le déposement
    pickup_allowed: {type: Boolean, required: true}, // autorise le ramassage
    skipped_stop: {type: Boolean, required: true}, // passage sans arrêt
    stop_point: {type: String, required: true}, // identifiant de la gare
    utc_arrival_time: {type: String, required: true}, // heure UTC d'arrivée
    utc_departure_time: {type: String, required: true}, // heure UTC de départ
});

const weekPatternSchema = new mongoose.Schema({
    monday: {type: Boolean, required: true},
    tuesday: {type: Boolean, required: true},
    wednesday: {type: Boolean, required: true},
    thursday: {type: Boolean, required: true},
    friday: {type: Boolean, required: true},
    saturday: {type: Boolean, required: true},
    sunday: {type: Boolean, required: true},
});

const journeySchema = new mongoose.Schema(
    {
        id_vehicle_journey: {type: String, required: true, unique: true},
        headsign: {type: String, required: true},
        stop_times: {type: [stopTimeSchema], required: true},
        departure: {type: String, required: true},
        arrival: {type: String, required: true},
        weekPattern: {type: weekPatternSchema, required: true},
    },
    {timestamps: true},
);

export const Journey = mongoose.model("Journey", journeySchema);
export const Station = mongoose.model("Station", stationSchema);
