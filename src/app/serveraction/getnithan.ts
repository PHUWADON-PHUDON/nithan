"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getAllNithan() {
    const nithan = await prisma.nithan.findMany();
    return nithan;
}