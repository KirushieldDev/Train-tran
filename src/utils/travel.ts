export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function calculatePrice(
    distanceKm: number,
    baseFare = 5, // tarif minimum
    ratePerKm = 0.12, // tarif au km
): number {
    const raw = baseFare + distanceKm * ratePerKm;
    return Math.round(raw * 100) / 100; // arrondi à 2 décimales
}
