import {NextResponse} from "next/server";
import nodemailer from "nodemailer";
import {renderToStream} from "@react-pdf/renderer";
import {PDFDocument} from "pdf-lib";
import TrainTicketPDF, {TrainTicketPDFProps} from "@traintran/components/Mail/TrainTicketPDF";
import {getUserFromRequest} from "@traintran/utils/getUserFromRequest";

export const runtime = "nodejs";

export async function POST(request: Request) {
    // Authentifier
    const user = await getUserFromRequest(request.headers);
    if (!user) {
        return NextResponse.json({error: "Non authentifié"}, {status: 401});
    }

    const {tickets} = (await request.json()) as {tickets: TrainTicketPDFProps[]};
    if (!tickets || !tickets.length) {
        return NextResponse.json({error: "Aucun billet fourni"}, {status: 400});
    }

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    // Séparer les pages « aller » et « retour » par index pair/impair
    const outboundPages = tickets.filter((_, i) => i % 2 === 0);
    const returnPages = tickets.filter((_, i) => i % 2 === 1);

    // Fonction utilitaire pour générer un buffer PDF à partir d'un array de props
    const makePdfBuffer = async (propsArr: TrainTicketPDFProps[]): Promise<Buffer> => {
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
    };

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

    return NextResponse.json({ok: true});
}
