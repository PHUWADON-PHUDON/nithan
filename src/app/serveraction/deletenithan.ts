"use server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl:string = process.env.SUPABASE_URL || "";
const supabaseKey:string = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl,supabaseKey);
const prisma = new PrismaClient();

export async function deleteNithan(id:number) {
    try{
        const findnithan = await prisma.nithan.findUnique({where:{id:Number(id)},include:{images:true}});

        if (findnithan) {
            if (findnithan.images.length > 0) {
                await Promise.all(findnithan.images.map( async (e) => {
                    if (e.imagename) {
                        const deletefileimage = await supabase.storage.from("nithanimages").remove([e.imagename]);
                        await prisma.image.delete({where:{id:Number(e.id)}});
                    }
                }));
            }

            await prisma.nithan.delete({where:{id:Number(id)}});
        }

        return({status:200});
    }
    catch(err) {
        return({status:500});
    }
}