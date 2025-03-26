import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { NextRequest,NextResponse } from "next/server";
const supabaseUrl:string = process.env.SUPABASE_URL || "";
const supabaseKey:string = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl,supabaseKey);
const prisma = new PrismaClient();

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

export async function POST(req:NextRequest) {
    try{
      const body = await req.json();
      const { value } = body;

      console.log(value);

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

      return(NextResponse.json(nithan));
    }
    catch(err) {
      return(NextResponse.json({err:err},{status:500}));
    }
}