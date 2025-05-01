import {IconArrowLeft, IconArrowRight} from "@tabler/icons-react";

interface CalendarHeaderProps {
    month: string;
}

export function CalendarHeader({month}: CalendarHeaderProps) {
    return (
        <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-bold text-black">{month}</h1>
            <nav className="flex gap-2">
                {/* Flèche gauche (précédent) */}
                <button className="flex justify-center items-center p-2 rounded" aria-label="Previous month">
                    <IconArrowLeft className="text-textSecondary" />
                </button>
                {/* Flèche droite (suivant) avec rotation */}
                <button className="flex justify-center items-center p-2 rounded" aria-label="Next month">
                    <IconArrowRight className="text-textSecondary" />
                </button>
            </nav>
        </div>
    );
}
