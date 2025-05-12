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

// Fonction pour récupérer le jour de la semaine à partir d'une date
export function getDayOfWeek(date: Date | string): string {
    // Si la date est une chaîne, la convertir en objet Date
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // On utilise 'en-US' pour avoir le nom du jour en anglais et 'long' pour avoir le nom complet
    return dateObj.toLocaleDateString("en-US", { weekday: "long" });
}

// Fonction pour vérifier si un trajet est disponible pour un jour de la semaine donné
export function isJourneyAvailableOnDay(dayOfWeek: string, weekPattern: any): boolean {
    if (!weekPattern) return true;

    const day = dayOfWeek.toLowerCase();
    switch (day) {
        case "monday":
            return weekPattern.monday;
        case "tuesday":
            return weekPattern.tuesday;
        case "wednesday":
            return weekPattern.wednesday;
        case "thursday":
            return weekPattern.thursday;
        case "friday":
            return weekPattern.friday;
        case "saturday":
            return weekPattern.saturday;
        case "sunday":
            return weekPattern.sunday;
        default:
            return false;
    }
}

// Convertit une heure UTC en heure locale (UTC+2)
export function formatTime(timeStr: string | undefined): string {
    if (!timeStr) return '';
    
    // Extraire les heures et minutes
    const hours = parseInt(timeStr.substring(0, 2));
    const minutes = parseInt(timeStr.substring(2, 4));
    const seconds = timeStr.length >= 6 ? parseInt(timeStr.substring(4, 6)) : 0;
    
    // Créer une date en UTC
    const date = new Date();
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(seconds);
    
    // Récupérer l'heure locale
    const localHours = date.getHours();
    const localMinutes = date.getMinutes();
    
    // Formater l'heure avec des zéros devant si nécessaire
    const formattedHours = localHours.toString().padStart(2, '0');
    const formattedMinutes = localMinutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
}

// Calcule la durée entre deux heures
export function calculateDuration(depTime: string | undefined, arrTime: string | undefined): string {
    if (!depTime || !arrTime) return '';
    
    const depHours = parseInt(depTime.substring(0, 2));
    const depMinutes = parseInt(depTime.substring(2, 4));
    const arrHours = parseInt(arrTime.substring(0, 2));
    const arrMinutes = parseInt(arrTime.substring(2, 4));
    
    let durationHours = arrHours - depHours;
    let durationMinutes = arrMinutes - depMinutes;
    
    if (durationMinutes < 0) {
        durationHours--;
        durationMinutes += 60;
    }
    
    return `${durationHours}h ${durationMinutes}m`;
}
