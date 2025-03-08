import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}) {
    try{
        const {id} = await params;

        const nithan = await prisma.nithan.findUnique({where:{id:Number(id)}});

        return(NextResponse.json(nithan));
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}