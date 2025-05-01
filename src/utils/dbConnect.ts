import mongoose, {Mongoose} from "mongoose";

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose>;
}

// On étend l’objet global pour y stocker le cache
declare global {
    // eslint-disable-next-line no-var
    var _mongooseCache: MongooseCache | undefined;
}

const MONGO_URI = process.env.DB_URL;
if (!MONGO_URI) {
    throw new Error("La variable d'environnement DB_URL doit être définie");
}

let cache: MongooseCache;
if (!global._mongooseCache) {
    global._mongooseCache = {
        conn: null,
        promise: mongoose.connect(MONGO_URI, {dbName: "traintran"}) as Promise<Mongoose>,
    };
}
cache = global._mongooseCache;

export default async function dbConnect(): Promise<Mongoose> {
    if (cache.conn) {
        return cache.conn;
    }
    cache.conn = await cache.promise;
    return cache.conn;
}
