import {NextResponse} from "next/server";
import {getUserFromRequest} from "@traintran/utils/getUserFromRequest";

export async function GET(request: Request) {
    const user = await getUserFromRequest(request.headers);
    return NextResponse.json({user: user});
}
