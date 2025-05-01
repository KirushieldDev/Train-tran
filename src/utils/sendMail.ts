import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import ReactDOMServer from "react-dom/server";
import {TrainTicket, TrainTicketProps} from "../components/Mail/TrainTicket.js";
import React from "react";
import pdf from "html-pdf";

/**
 * Rend le composant en HTML complet avec Tailwind via CDN
 */
function renderFullHTML(ticket: TrainTicketProps): string {
    const body = ReactDOMServer.renderToStaticMarkup(React.createElement(TrainTicket, ticket));
    return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          .rotate-90 { transform: rotate(90deg); }
          body { margin:0; padding:0; display:flex; align-items:center; justify-content:center; height:100vh; }
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;
}

/**
 * Génère un PDF depuis le HTML du billet via html-pdf
 */
async function htmlToPdfBuffer(html: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        pdf.create(html, {
            format: "A4",
            border: "0",
            phantomArgs: ["--ignore-ssl-errors=yes"],
        }).toBuffer((err, buffer) => {
            if (err) return reject(err);
            resolve(buffer);
        });
    });
}

/**
 * Envoie un e-mail avec les billets joints au format PDF
 */
export async function sendTickets(tickets: TrainTicketProps[], recipientEmail: string): Promise<void> {
    const user = process.env.MAIL_USER!;
    const pass = process.env.MAIL_PASSWORD!;
    const host = process.env.MAIL_HOST!;
    const port = parseInt(process.env.MAIL_PORT!, 10);
    if (!user || !pass) throw new Error("Variables d’environnement MAIL_USER et MAIL_PASSWORD requises");

    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: false,
        auth: {user, pass},
    });

    const attachments = await Promise.all(
        tickets.map(async (ticket, idx) => {
            const html = renderFullHTML(ticket);
            const pdfBuffer = await htmlToPdfBuffer(html);
            return {
                filename: `billet-${idx + 1}.pdf`,
                content: pdfBuffer,
            };
        }),
    );

    await transporter.sendMail({
        from: `TrainTran <${user}>`,
        to: recipientEmail,
        subject: "Vos billets de train",
        text: "Veuillez trouver vos billets de train en pièces jointes.",
        attachments,
    });
}
