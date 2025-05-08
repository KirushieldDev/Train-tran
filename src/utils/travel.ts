export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Convertit les degrés en radians
    const toRad = (x: number) => (x * Math.PI) / 180;
    // Rayon de la Terre en km
    const R = 6371;

    // Différences de latitude et de longitude en radians
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    // Formule de Haversine qui permet de calculer la distance entre deux points sur la surface d'une sphère
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    // Calcule l'angle central en radians entre les deux points sur la sphère pour determiner la distance réelle
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Retourne la distance en kilomètres
    return R * c;
}

export function calculatePrice(
    distanceKm: number,
    baseFare = 5, // tarif minimum
    ratePerKm = 0.12, // tarif au km
): number {
    // Calcule le prix brut en ajoutant le tarif de base et le coût par kilomètre
    const raw = baseFare + distanceKm * ratePerKm;

    // On arrondit le prix à deux décimales
    return Math.round(raw * 100) / 100;
}

export function calculatePriceWithDayAdjustment(
    distanceKm: number,
    dayOfWeek: string,
    baseFare = 5, // tarif minimum
    ratePerKm = 0.12, // tarif au km
): number {
    // Calcule le prix brut en ajoutant le tarif de base et le coût par kilomètre
    let raw = baseFare + distanceKm * ratePerKm;

    // On ajuste les prix en fonction du jour de la semaine
    if (dayOfWeek === "Sunday" || dayOfWeek === "Saturday") {
        // On augmente le prix de 20% le week-end
        raw *= 1.2;
    } else {
        if (dayOfWeek === "Wednesday") {
            // On applique une réduction de 5% le mercredi
            raw *= 0.95;
        }
    }
    // On arrondit le prix à deux décimales
    return Math.round(raw * 100) / 100;
}
