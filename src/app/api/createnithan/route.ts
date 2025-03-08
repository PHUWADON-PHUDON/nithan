import { NextRequest,NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();
const supabaseUrl:string = process.env.SUPABASE_URL || "";
const supabaseKey:string = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl,supabaseKey);

interface UploadPromiseType {
    imageurl:string;
    blob:string;
    filename:string;
  }

export async function POST(req:NextRequest) {
    try{
        const formdata = await req.formData();
        const title:string = formdata.get("title") as string;
        let content:string = formdata.get("content") as string;
        const images:File[] = formdata.getAll("images") as File[];
        const blobs:string[] = formdata.getAll("blobs") as string[];
        let uploadpromise:UploadPromiseType[] = [];
        
        const generateUniqueFileName = () => {
            const now = new Date();
            const dateStr:string = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
              now.getDate()
            ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(
              now.getMinutes()
            ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
            const randomStr:string = Math.random().toString(36).substring(2, 10);
            return `${dateStr}-${randomStr}`;
        }

        if (images.length > 0) {
            uploadpromise = await Promise.all(images.map( async (file,i:number) => {
                const buffer = Buffer.from(await file.arrayBuffer());
                const compressedBuffer = await sharp(buffer).jpeg({ quality: 50 }).toBuffer();
                const compressedFile = new File([compressedBuffer], file.name, { type: "image/jpeg" });
        
                const filePath:string = `${generateUniqueFileName()}`;
                const uploadfile = await supabase.storage.from("nithanimages").upload(filePath,compressedFile);
                const { data } = supabase.storage.from("nithanimages").getPublicUrl(filePath);
                const imageurl:string = data.publicUrl;
                return({imageurl:imageurl,blob:blobs[i],filename:filePath});
            }));

            uploadpromise.forEach((e:UploadPromiseType) => {
                content = content.replace(e.blob,e.imageurl);
            });
        }

        const createnithan = await prisma.nithan.create({
            data:{
                title:title,
                content:content,
                favorite:0
            }
        });

        if (uploadpromise.length > 0) {
            await Promise.all(uploadpromise.map( async (e) => {
                await prisma.image.create({
                    data:{
                        nithanid:Number(createnithan.id),
                        imagename:e.filename
                    }
                });
            }));
        }

        return(NextResponse.json({}));
    }
    catch(err) {
        return(NextResponse.json({err:err},{status:500}));
    }
}