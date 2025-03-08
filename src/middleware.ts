import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req:NextRequest) {
    const login = req.cookies.get("login");

    if (login?.value === "true") {
        return NextResponse.next();
    }
    else {
        return NextResponse.redirect(new URL("/admin",req.url));
    }
}

export const config = { matcher: ['/admin/managenithan','/admin/createnithan'] }