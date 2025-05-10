import {getUserFromRequest} from "@traintran/utils/getUserFromRequest";
import {NextResponse} from "next/server";
import {Ticket} from "@traintran/context/CartContext";
import {UserInfo} from "@traintran/context/AuthContext";
import {getAllPages, makePdfBuffer} from "@traintran/utils/purchaseUtils";

export const runtime = "nodejs";

export async function POST(request: Request) {
    // authentification
    const user = await getUserFromRequest(request.headers);
    if (!user) return NextResponse.json({error: "Non authentifié"}, {status: 401});

    // lire body
    const {ticket, segment} = (await request.json()) as {
        ticket?: Ticket;
        segment?: "outbound" | "return";
    };
    if (!ticket || !segment) {
        return NextResponse.json({error: "Données invalides"}, {status: 400});
    }

    // générer les pages
    const pages = getAllPages(user as UserInfo, ticket);
    const filtered = segment === "outbound" ? pages.filter((_, i) => i % 2 === 0) : pages.filter((_, i) => i % 2 === 1);
    if (filtered.length === 0) {
        return NextResponse.json({error: `Pas de pages pour '${segment}'`}, {status: 400});
    }

    // créer le PDF
    const buffer = await makePdfBuffer(filtered);

    return new NextResponse(buffer, {status: 200, headers: {"Content-Type": "application/pdf"}});
}
