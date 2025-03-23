

interface PricingSummaryProps {
    lowestPrice: number;
    averagePrice: number;
    highestPrice: number;
}

export function PricingSummary({
                                   lowestPrice,
                                   averagePrice,
                                   highestPrice,
                               }: PricingSummaryProps) {
    return (
        <section className="flex flex-col gap-2.5 p-4 w-full bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                    <h2 className="text-sm text-gray-600">Prix le plus bas</h2>
                    <p className="text-xl font-bold text-emerald-600">{lowestPrice} €</p>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-sm text-gray-600">Prix moyen</h2>
                    <p className="text-xl font-bold text-black">{averagePrice} €</p>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-sm text-gray-600">Prix le plus élevé</h2>
                    <p className="text-xl font-bold text-black">{highestPrice} €</p>
                </div>
            </div>
        </section>
    );
}
