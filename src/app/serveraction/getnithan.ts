"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllNithan() {
    const nithan = await prisma.nithan.findMany({orderBy:{id:"desc"}});
    return nithan;
}

export async function getNithan(id:number) {
    const nithan = await prisma.nithan.findUnique({where:{id:id},include:{images:true}});
    return nithan;
}