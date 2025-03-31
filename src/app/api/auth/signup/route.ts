import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
const prisma = new PrismaClient();

interface BodyType {
   name:string;
   gmail:string;
   password:string; 
}

export async function POST(req:NextRequest) {
    try{
        const {name,gmail,password} = await req.json();
        const hashpassword = bcrypt.hashSync(password,10);

        const newuser = await prisma.user.create({data:{
            name:name,
            gmail:gmail,
            password:hashpassword
        }});

        if (newuser) {
            const token = Jwt.sign(
                { id: newuser.id, gmail: newuser.gmail, name: newuser.name },
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
            throw new Error();
        }
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}