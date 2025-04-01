import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { error } from "console";
const prisma = new PrismaClient();

export async function POST(req:Request) {
    try{
        const body = await req.json();

        if (body.islove) {
            const finduser = await prisma.favorite.findFirst({where:{userid:Number(body.userid),nithanid:Number(body.nithanid)}});

            if (finduser) {
                return(NextResponse.json(""));
            }
            else {
                const createfavuser = await prisma.favorite.create({data:{userid:Number(body.userid),nithanid:Number(body.nithanid)}});

                return(NextResponse.json(""));
            }
        }
        else {
            const finduser = await prisma.favorite.findFirst({where:{userid:Number(body.userid),nithanid:Number(body.nithanid)}});

            if (finduser) {
                await prisma.favorite.delete({where:{id:finduser.id}});
                return(NextResponse.json(""));
            }
            else {
                throw new Error();
            }
        }
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}