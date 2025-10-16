"use server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import NodeCache from "node-cache";
const supabaseUrl:string = process.env.SUPABASE_URL || "";
const supabaseKey:string = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl,supabaseKey);
const prisma = new PrismaClient();
const cache = new NodeCache({ stdTTL: 3600 });

interface ImageType {
    id:number;
    nithanid:number;
    imagename:string;
    createAt:Date;
    imageurl:string;
  }
  
  interface NiThanType {
    id:number;
    title:string;
    content:string | null;
    favorite:number | null;
    createAt:Date;
    images:ImageType[];
  }

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
        const cached = cache.get(1);
        if (cached) return({status:200,nithan:cached});

        const nithan:NiThanType[] | null = await prisma.nithan.findMany({orderBy:{id:"desc"},include:{images:true},take:4}) as NiThanType[] | null;

        if (nithan) {
            Promise.all(nithan.map((e,i) => {
                if (e.images.length > 0) {
                    const { data } = supabase.storage.from("nithanimages").getPublicUrl(e.images[0].imagename + "");
                    const imageurl:string = data.publicUrl;
                    nithan[i].images[0].imageurl = imageurl;
                }
            }));
        }

        cache.set(1,nithan);

        return({status:200,nithan:nithan});
    }
    catch(err) {
        return({status:500});
    }
}

export async function searchNithan(value:string) {
    try{
        const nithan:NiThanType[] | null = await prisma.nithan.findMany({
            where:{
                title:{
                    contains:value,
                    mode:"insensitive"
                }
            },
            include:{images:true}
        }) as NiThanType[] | null;

        if (nithan) {
            Promise.all(nithan.map((e,i) => {
                if (e.images.length > 0) {
                    const { data } = supabase.storage.from("nithanimages").getPublicUrl(e.images[0].imagename + "");
                    const imageurl:string = data.publicUrl;
                    nithan[i].images[0].imageurl = imageurl;
                }
            }));
        }

        return({status:200,nithan:nithan});
    }
    catch(err) {
        return({status:500});
    }
}