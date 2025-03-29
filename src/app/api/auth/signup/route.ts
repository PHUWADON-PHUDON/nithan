import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
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

        return(NextResponse.json(newuser));
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}