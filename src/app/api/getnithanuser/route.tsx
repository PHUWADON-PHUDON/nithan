import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import NodeCache from "node-cache";
const prisma = new PrismaClient();
const cache = new NodeCache({ stdTTL: 3600 });

export async function GET(req:NextRequest) {
    try{
        const searchparam = req.nextUrl.searchParams;
        const id = searchparam.get("id");

        const cached = cache.get(`b:{${id!}}`);
        if (cached) return NextResponse.json(cached);

        const nithan = await prisma.nithan.findUnique({where:{id:Number(id)},include:{favorites:true}});

        cache.set(`b:{${id!}}`, nithan);

        return(NextResponse.json(nithan));
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}