import {NextResponse} from "next/server";
import {getUserFromRequest} from "@traintran/utils/getUserFromRequest";

// GET – renvoie l'utilisateur authentifié à partir des headers
export async function GET(request: Request) {
    const user = await getUserFromRequest(request.headers);
    if (!user) return NextResponse.json({ok: false, user: null});
    return NextResponse.json({ok: true, user: user});
}
