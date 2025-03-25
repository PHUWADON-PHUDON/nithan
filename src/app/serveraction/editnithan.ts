"use server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
const prisma:PrismaClient = new PrismaClient();
const supabaseUrl:string = process.env.SUPABASE_URL || "";
const supabaseKey:string = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl,supabaseKey);

interface UploadPromiseType {
    imageurl:string;
    blob:string;
    filename:string;
}

interface FindImageType {
    id: number;
    imagename: string | null;
    postid: number;
    createAt: Date;
}

interface ImageType {
    id:number;
    nithanid:number;
    imagename:string;
    createAt:Date;
}

export async function editNithan(id:number,finddelete:ImageType[],images:File[],blobs:string[],inputtitle:string,content:string) {
    try{
        let uploadpromise:UploadPromiseType[] = [];

        //generate file name
        const generateUniqueFileName = () => {
            const now:Date = new Date();
            const dateStr:string = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
              now.getDate()
            ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(
              now.getMinutes()
            ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
            const randomStr:string = Math.random().toString(36).substring(2, 10);
            return `${dateStr}-${randomStr}`;
        }

        //delete images file and delete image name in database 
        if (finddelete.length > 0) {
            await Promise.all(finddelete.map( async (e:ImageType) => {
                const findimage:ImageType = await prisma.image.findUnique({where:{id:Number(e.id)}}) as ImageType;

                if (findimage.imagename) {
                    const deletefileimage = await supabase.storage.from("nithanimages").remove([findimage.imagename]);

                    await prisma.image.delete({where:{id:Number(e.id)}});
                }
            }));
        }

        //compress images file and create images file in supabase
        if (images.length > 0) {
            uploadpromise = await Promise.all(images.map( async (file:File,i:number) => {
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

        //update title,content on nithan table
        const createpost = await prisma.nithan.update({
            where:{id:Number(id)},
            data:{
                title:inputtitle,
                content:content
            }
        });

        //create images name on image table
        if (uploadpromise.length > 0) {
            await Promise.all(uploadpromise.map( async (e:UploadPromiseType) => {
              await prisma.image.create({data:{
                imagename:e.filename,
                nithanid:Number(createpost.id)
              }});
            }));
        }

        return({status:200});
    }
    catch(err) {
        return({status:500});
    }
}