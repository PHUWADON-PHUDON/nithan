import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

export async function GET(req:NextRequest) {
    try{
        const token = req.cookies.get('token')?.value;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                id: number;
                gmail: string;
                name?: string;
            };

            if (decoded) {
                const finduser = await prisma.user.findUnique({where:{id:decoded.id}});

                if (finduser) {
                    return(NextResponse.json({token:true,name:finduser.name}));
                }
                else {
                    return(NextResponse.json({token:false}));
                }
            }
            else {
                return(NextResponse.json({token:false}));
            }
        }
        else {
            return(NextResponse.json({token:false}));
        }
    }
    catch(err) {
        return(NextResponse.json({err},{status:500}));
    }
}