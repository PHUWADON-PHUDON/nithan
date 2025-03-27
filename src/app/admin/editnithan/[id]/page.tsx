"use client";
import { useState,useEffect } from "react";
import { useRouter,useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getNithan } from "@/app/serveraction/getnithan";
import { editNithan } from "@/app/serveraction/editnithan";
const Editor = dynamic(() => import("@/components/Editor"),{ssr:false,loading:() => <p className="mt-[50px] text-center">Loading...</p>});

interface ImageFileType {
    file:File;
    blob:string;
}

interface ImageType {
    id:number;
    nithanid:number;
    imagename:string;
    createAt:Date;
}

interface NiThanType {
    id:number;
    title:string;
    content:string;
    images:ImageType[];
    favorite:number;
    createAt:Date;
}

export default function editnithan() {
    const [inputtitle,setinputtitle] = useState<string>("");
    const [inputfile,setinputfile] = useState<ImageFileType[]>([]);
    const [content,setcontent] = useState<string>("");
    const [findimagesdelete,setfindimagesdelete] = useState<ImageType[]>([]);
    const [waitedit,setwaitedit] = useState<boolean>(false);
    const [isload,setisload] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams();

    //!load data

    useEffect(() => {
        const loaddata = async () => {
            try{
                const res:{nithan:NiThanType,status:number} | null = await getNithan(Number(params.id)) as {nithan:NiThanType,status:number} | null;
                if (res!.status === 200) {
                    setinputtitle(res!.nithan.title);
                    setcontent(res!.nithan.content);
                    setfindimagesdelete(res!.nithan.images);
                }
                else {
                    alert("เกิดข้อผิดพลาด");
                    window.location.reload();
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        loaddata();
    },[]);

    //!

    //!submit edit

    const edit = async () => {
        try{
            const newinputfile:ImageFileType[] = inputfile.filter((e:ImageFileType) => {
                if (content.includes(e.blob)) {
                    return(e);
                }
            });

            const newfindimagesdelete:ImageType[] = findimagesdelete.filter((e:ImageType) => {
                if (!content.includes(e.imagename)) {
                    return(e);
                }
            });

            const images = newinputfile.map(e => e.file);
            const blobs = newinputfile.map(e => e.blob);

            setwaitedit(true);
            const res = await editNithan(Number(params.id),newfindimagesdelete,images,blobs,inputtitle,content);
            if (res.status === 200) {
                router.back();
            }
            else {
                alert("เกิดข้อผิดพลาดระหว่างแก้ไข");
                router.back();
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    //!

    return(
        <div className="p-[20px] h-[100dvh] flex flex-col">
            <h1 className="font-bold text-[40px]">Create Nithan</h1>
            <input onChange={(e) => setinputtitle(e.target.value)} value={inputtitle} className="border-b border-gray-400 m-[10px_0] w-[350px]" placeholder="Iput Title..." type="text" />
            {content ? <Editor content={content} setcontent={setcontent} setinputfile={setinputfile} setisload={setisload}/>:<p className="mt-[50px] text-center">Loading...</p>}
            {isload ? 
                (waitedit ? 
                    <button type="button" className="bg-[#4e8df1ad] text-[#fff] inline-block p-[10px_1.5rem] font-bold rounded-[8px] mt-[10px] w-[160px] cursor-pointer">Wait...</button>
                    :
                    <button onClick={() => edit()} type="button" className="bg-[#4e8cf1] text-[#fff] inline-block p-[10px_1.5rem] font-bold rounded-[8px] mt-[10px] w-[160px] cursor-pointer">Create Nithan</button>)
                :
                ""
            }
        </div>
    );
}