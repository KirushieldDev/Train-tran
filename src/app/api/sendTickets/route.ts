import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import dotenv from "dotenv";
import { TrainTicketProps } from "@traintran/components/Mail/TrainTicket";
dotenv.config();

//export const runtime = "nodejs"; // garantit un runtime Node complet

async function generatePdfFromUrl(ticket: TrainTicketProps): Promise<Buffer> {
    const url = `${process.env.NEXT_PUBLIC_URL}/train-ticket?data=${encodeURIComponent(
        JSON.stringify(ticket)
    )}`;

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const pdfArray = await page.pdf({ format: "A4", margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    await browser.close();
    return Buffer.from(pdfArray);
}

async function sendTicketsByMail(
    tickets: TrainTicketProps[],
    recipientEmail: string
): Promise<void> {
    const user = process.env.MAIL_USER!;
    const pass = process.env.MAIL_PASSWORD!;
    const host = process.env.MAIL_HOST!;
    const port = parseInt(process.env.MAIL_PORT!, 10);

    if (!user || !pass) throw new Error("MAIL_USER et MAIL_PASSWORD requis");

    const transporter = nodemailer.createTransport({ host, port, secure: false, auth: { user, pass } });
    const attachments = await Promise.all(
        tickets.map(async (ticket, idx) => ({
            filename: `billet-${idx + 1}.pdf`,
            content: await generatePdfFromUrl(ticket),
        }))
    );

    await transporter.sendMail({
        from: `TrainTran <${user}>`,
        to: recipientEmail,
        subject: "Vos billets de train",
        text: "Veuillez trouver vos billets de train en pièces jointes.",
        attachments,
    });
}

export async function POST(request: Request) {
    const { tickets, recipientEmail } = await request.json();
    if (!recipientEmail) {
        return NextResponse.json({ error: "Email du destinataire manquant" }, { status: 400 });
    }
    await sendTicketsByMail(tickets as TrainTicketProps[], recipientEmail);
    return NextResponse.json({ ok: true });
}