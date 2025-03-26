"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllNithan() {
    try {
        //get all data
        const nithan = await prisma.nithan.findMany({orderBy:{id:"desc"}});

        return({status:200,nithan:nithan});
    }
    catch {
        return({status:500});
    }
}

export async function getNithan(id:number) {
    try {
        //get 1 data
        const nithan = await prisma.nithan.findUnique({where:{id:id},include:{images:true}});

        return({status:200,nithan:nithan});
    }
    catch {
        return({status:500});
    }
}

export async function getNithanHome() {
    try{
        const nithan = await prisma.nithan.findMany({orderBy:{id:"desc"},take:4});

        return({status:200,nithan:nithan});
    }
    catch(err) {
        return({status:500});
    }
}