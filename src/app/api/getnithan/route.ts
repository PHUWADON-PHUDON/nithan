import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { NextRequest,NextResponse } from "next/server";
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

export async function GET(req:NextRequest) {
    try{
        const searchparam = req.nextUrl.searchParams;
        const page = searchparam.get("page") || 1;

        const cached = cache.get(`c:{${page}}`);
        if (cached) return NextResponse.json(cached);

        const countnithan:number | null = await prisma.nithan.count() as number | null;

        const nithan:NiThanType[] | null = await prisma.nithan.findMany({include:{images:true},take:5,skip:Number(page) * 5 - 5,orderBy:{id:"desc"}}) as NiThanType[] | null;
      
        if (nithan) {
          Promise.all(nithan.map((e,i) => {
            if (e.images.length > 0) {
              const { data } = supabase.storage.from("nithanimages").getPublicUrl(e.images[0].imagename + "");
              const imageurl:string = data.publicUrl;
              nithan[i].images[0].imageurl = imageurl;
            }
          }));
        }

        cache.set(`c:{${page}}`,{nithan:nithan,countnithan:countnithan});

        return(NextResponse.json({nithan:nithan,countnithan:countnithan}));
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}