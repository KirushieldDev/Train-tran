import nodemailer from "nodemailer";
import TrainTicketPDF, {TrainTicketPDFProps} from "@traintran/components/Mail/TrainTicketPDF";
import {PDFDocument} from "pdf-lib";
import {renderToStream} from "@react-pdf/renderer";
import {UserInfo} from "@traintran/context/AuthContext";
import {Passenger, Ticket} from "@traintran/context/CartContext";
import dbConnect from "@traintran/utils/dbConnect";
import getOptionById, {Option} from "@traintran/lib/options";
import {Account} from "@traintran/database/models/account";

export async function purchaseCart(user: UserInfo, tickets: Ticket) {
    await dbConnect();
    await saveTicket(user, tickets);
    await sendTicketMail(user, tickets);
}

async function saveTicket(user: UserInfo, rawTicket: Ticket) {
    await Account.updateOne(
        {_id: user.sub},
        {
            $push: {
                tickets: {
                    outbound: {
                        ...rawTicket.outbound,
                        departureTime: new Date(rawTicket.outbound.departureTime),
                        arrivalTime: new Date(rawTicket.outbound.arrivalTime),
                    },
                    inbound: rawTicket.inbound
                        ? {
                              ...rawTicket.inbound,
                              departureTime: new Date(rawTicket.inbound.departureTime),
                              arrivalTime: new Date(rawTicket.inbound.arrivalTime),
                          }
                        : undefined,
                    passengers: rawTicket.passengers,
                    options: rawTicket.options,
                    basePrice: rawTicket.basePrice,
                },
            },
        },
    );
}

// Transforme un segment + passager en props PDF en injectant orderer depuis user
function buildPropsForPassenger(user: UserInfo, ticket: Ticket, passenger: Passenger): TrainTicketPDFProps {
    if (!user) throw new Error("Utilisateur non connecté");
    // on récupère les objets Option à partir des IDs
    const resolvedOptions: Option[] = ticket.options.map(id => getOptionById(id)).filter((o): o is Option => !!o);

    // Assigne aléatoirement la voiture (1-10) et le siège (1-100)
    const carNumber = (Math.floor(Math.random() * 10) + 1).toString();
    const seatNumber = (Math.floor(Math.random() * 100) + 1).toString();

    return {
        passenger: passenger,
        journeySegment: ticket.outbound,
        carNumber,
        seatNumber,
        options: resolvedOptions,
    };
}

// Pour chaque ticket, une page par passager et par segment
export function getAllPages(user: UserInfo, ticket: Ticket): TrainTicketPDFProps[] {
    if (!ticket) return [];
    return ticket.passengers.flatMap(
        p =>
            [
                buildPropsForPassenger(user, ticket, p),
                ticket.inbound ? buildPropsForPassenger(user, {...ticket, outbound: ticket.inbound}, p) : undefined,
            ].filter(Boolean) as TrainTicketPDFProps[],
    );
}

// Fonction utilitaire pour générer un buffer PDF à partir d'un array de props
export async function makePdfBuffer(propsArr: TrainTicketPDFProps[]): Promise<Buffer> {
    const mergedPdf = await PDFDocument.create();
    for (const props of propsArr) {
        const stream = await renderToStream(<TrainTicketPDF {...props} />);
        const chunks: Uint8Array[] = [];
        for await (const chunk of stream) chunks.push(Buffer.from(chunk));
        const buf = Buffer.concat(chunks);

        const donor = await PDFDocument.load(buf);
        const [page] = await mergedPdf.copyPages(donor, [0]);
        mergedPdf.addPage(page);
    }
    const finalBytes = await mergedPdf.save();
    return Buffer.from(finalBytes);
}

async function sendTicketMail(user: UserInfo, tickets: Ticket) {
    const ticketPages = getAllPages(user, tickets);

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    // Séparer les pages « aller » et « retour » par index pair/impair
    const outboundPages = ticketPages.filter((_, i) => i % 2 === 0);
    const returnPages = ticketPages.filter((_, i) => i % 2 === 1);

    // Base du nom de fichier
    const journeySegment = outboundPages[0].journeySegment;
    const baseName = `${journeySegment.departureStation}-${journeySegment.arrivalStation}`;

    const attachments: {filename: string; content: Buffer}[] = [];

    if (outboundPages.length) {
        const buf = await makePdfBuffer(outboundPages);
        attachments.push({filename: `${baseName}-aller.pdf`, content: buf});
    }
    if (returnPages.length) {
        const buf = await makePdfBuffer(returnPages);
        attachments.push({filename: `${baseName}-retour.pdf`, content: buf});
    }

    // Envoi du mail
    await transporter.sendMail({
        from: `TrainTran <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: `TrainTran - Vos billets ${journeySegment.departureStation} - ${journeySegment.arrivalStation}`,
        text:
            `Bonjour ${user.firstName} ${user.lastName},\n\n` +
            `Vous trouverez ci-joints vos billets aller (et retour le cas échéant).\n\n` +
            `Bon voyage,\nL'équipe TrainTran`,
        attachments,
    });
}
