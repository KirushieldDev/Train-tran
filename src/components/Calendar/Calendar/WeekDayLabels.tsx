
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekDayLabels() {
    return (
        <>
            {WEEKDAYS.map((day) => (
                <div
                    key={day}
                    className="px-0 py-2 text-base text-center text-gray-500 w-[150px]"
                >
                    {day}
                </div>
            ))}
        </>
    );
}
