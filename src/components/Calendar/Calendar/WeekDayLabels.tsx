const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekDayLabels() {
    return (
        <div className="flex w-full">
            {WEEKDAYS.map((day) => (
                <div
                    key={day}
                    className="flex-1 py-2 text-base text-center text-gray-500"
                >
                    {day}
                </div>
            ))}
        </div>
    );
}
