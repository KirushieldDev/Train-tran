import { TrainTicket, TrainTicketProps } from "@traintran/components/Mail/TrainTicket";

export default function TrainTicketPage({ searchParams }: { searchParams: { data: string } }) {
    const ticket: TrainTicketProps = JSON.parse(searchParams.data || "{}");
    return <TrainTicket {...ticket} />;
}