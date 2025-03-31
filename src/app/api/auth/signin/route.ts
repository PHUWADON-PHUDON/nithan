import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

export async function POST(req:NextRequest) {
    try{
        const { gmail, password } = await req.json();

        const finduser = await prisma.user.findUnique({ where: {gmail:gmail} });

        if (finduser) {
            const isvalid = await bcrypt.compare(password,finduser.password);

            if (isvalid) {
                const token = jwt.sign(
                    { id: finduser.id, gmail: finduser.gmail, name: finduser.name },
                    process.env.JWT_SECRET!,
                    { expiresIn: '1d' }
                );

                const response = NextResponse.json({ message: 'Logged in' }, { status: 200 });
                response.cookies.set('token', token, {
                    path: '/',
                    maxAge: 24 * 60 * 60
                });

                return(response);
            }
            else {
                return(NextResponse.json({err:"invali gmail or password"},{status:401}));
            }
        }
        else {
            return(NextResponse.json({err:"not found"},{status:404}));
        }
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}