import {NextResponse} from "next/server";
import {getUserFromRequest} from "@traintran/utils/getUserFromRequest";
import {resendTicket} from "@traintran/utils/purchaseUtils";
import {Ticket} from "@traintran/context/CartContext";

export const runtime = "nodejs";

export async function POST(request: Request) {
    // 1) Authentification
    const user = await getUserFromRequest(request.headers);
    if (!user) {
        return NextResponse.json({error: "Non authentifié"}, {status: 401});
    }

    // 2) Lecture et validation du body
    let body: {ticket?: Ticket};
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({error: "JSON invalide"}, {status: 400});
    }
    if (!body.ticket) {
        return NextResponse.json({error: "Aucun billet fourni"}, {status: 400});
    }

    // 3) Traitement (BDD + mail)
    try {
        await resendTicket(user, body.ticket);
    } catch (err: unknown) {
        console.error("Erreur interne purchaseCart:", err);
        const msg = err instanceof Error ? err.message : "Erreur interne lors de la commande";
        return NextResponse.json({error: msg}, {status: 500});
    }

    return NextResponse.json({ok: true});
}
