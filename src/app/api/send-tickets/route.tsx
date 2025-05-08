import {NextResponse} from "next/server";
import nodemailer from "nodemailer";
import {renderToStream} from "@react-pdf/renderer";
import {PDFDocument} from "pdf-lib";
import TrainTicketPDF, {TrainTicketPDFProps} from "@traintran/components/Mail/TrainTicketPDF";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const {tickets: ticketsGroups, recipientEmail} = (await request.json()) as {
        tickets: TrainTicketPDFProps[][];
        recipientEmail: string;
    };
    if (!recipientEmail) {
        return NextResponse.json({error: "Email du destinataire manquant"}, {status: 400});
    }

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const attachments = await Promise.all(
        ticketsGroups.flatMap(async pages => {
            // Séparer pages outbound (i pair) et return (i impair)
            const outboundPages = pages.filter((_, i) => i % 2 === 0);
            const returnPages = pages.filter((_, i) => i % 2 === 1);

            // Helper qui monte un <Document> depuis un array de props
            const makePdfBuffer = async (propsArr: TrainTicketPDFProps[]): Promise<Buffer> => {
                // on crée un document vide
                const mergedPdf = await PDFDocument.create();

                for (const props of propsArr) {
                    // on génère le PDF une page (via le composant Document unique)
                    const stream = await renderToStream(<TrainTicketPDF {...props} />);
                    const chunks: Uint8Array[] = [];
                    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
                    const buf = Buffer.concat(chunks);

                    // on copie la page 0 de ce PDF dans notre mergedPdf
                    const donor = await PDFDocument.load(buf);
                    const [page] = await mergedPdf.copyPages(donor, [0]);
                    mergedPdf.addPage(page);
                }

                const finalBytes = await mergedPdf.save();
                return Buffer.from(finalBytes);
            };

            // nom de base depuis le premier props
            const baseName = `${outboundPages[0].departureStation}-${outboundPages[0].arrivalStation}`;

            const result: {filename: string; content: Buffer}[] = [];
            // Générer le PDF "aller"
            if (outboundPages.length) {
                const buf = await makePdfBuffer(outboundPages);
                result.push({
                    filename: `${baseName}-aller.pdf`,
                    content: buf,
                });
            }
            // Générer le PDF "retour" si on a des pages return
            if (returnPages.length) {
                const buf = await makePdfBuffer(returnPages);
                result.push({
                    filename: `${baseName}-retour.pdf`,
                    content: buf,
                });
            }
            return result;
        }),
    ).then(arr => arr.flat());

    // Envoi du mail
    const {ordererFirstName, ordererLastName} = ticketsGroups[0][0];
    await transporter.sendMail({
        from: `TrainTran <${process.env.MAIL_USER}>`,
        to: recipientEmail,
        subject: `TrainTran - Vos billets ${ticketsGroups[0][0].departureStation} - ${ticketsGroups[0][0].arrivalStation}`,
        text:
            `Bonjour ${ordererFirstName} ${ordererLastName},\n\n` +
            `Vous trouverez ci-joints vos billets aller (et retour le cas échéant).\n\n` +
            `Bon voyage,\nL'équipe TrainTran`,
        attachments,
    });

    return NextResponse.json({ok: true});
}
