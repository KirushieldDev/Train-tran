"use client";


interface PaymentActionsProps {
    onModify?: () => void;
    onConfirmAndPay?: () => void;
}

export default function Buttons({
                                           onModify,
                                           onConfirmAndPay,
                                       }: PaymentActionsProps) {
    return (
        <section className="flex gap-4 justify-end items-start w-full h-12 bg-black bg-opacity-0 max-sm:flex-col max-sm:gap-3 max-sm:h-auto">
            <button
                onClick={onModify}
                className="px-6 py-3.5 h-12 text-base text-center text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors max-sm:w-full"
                aria-label="Modifier"
            >
                Modifier
            </button>
            <button
                onClick={onConfirmAndPay}
                className="px-6 py-3.5 h-12 text-base text-center text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors max-sm:w-full"
                aria-label="Confirmer et payer"
            >
                Confirmer et payer
            </button>
        </section>
    );
}
