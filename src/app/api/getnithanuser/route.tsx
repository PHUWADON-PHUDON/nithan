import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req:NextRequest) {
    try{
        const searchparam = req.nextUrl.searchParams;
        const id = searchparam.get("id");

        const nithan = await prisma.nithan.findUnique({where:{id:Number(id)}});

        return(NextResponse.json(nithan));
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}