export type CalendrierProps = {
    searchParams: Promise<{
        departure: string;
        arrival: string;
        departure_date: string;
        return_date: string;
    }>
};
