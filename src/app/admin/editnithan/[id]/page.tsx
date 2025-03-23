"use client";
import { useState,useEffect } from "react";
import { useRouter,useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getNithan } from "@/app/serveraction/getnithan";
const Editor = dynamic(() => import("@/components/Editor"),{ssr:false,loading:() => <p className="mt-[50px] text-center">Loading...</p>});

interface ImageFileType {
    file:File;
    blob:string;
}

interface NiThanType {
    id:number;
    title:string;
    content:string;
    favorite:number;
    createAt:Date;
}

export default function editnithan() {
    const [inputtitle,setinputtitle] = useState<string>("");
    const [content,setcontent] = useState<string>("");
    const [inputfile,setinputfile] = useState<ImageFileType[]>([]);
    const [isloadeditor,setisloadeditor] = useState<boolean>(false);
    const [waitcreate,setwaitcreate] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams();

    //!load data

    useEffect(() => {
        const loaddata = async () => {
            try{
                const res:NiThanType | null = await getNithan(Number(params.id)) as NiThanType | null;
                setcontent(res!.content);
            }
            catch(err) {
                console.log(err);
            }
        }

        loaddata();
    },[]);

    //!

    const createNithan = () => {
        
    }

    return(
        <div className="p-[20px] h-[100dvh] flex flex-col">
            <h1 className="font-bold text-[40px]">Create Nithan</h1>
            <input onChange={(e) => setinputtitle(e.target.value)} className="border-b border-gray-400 m-[10px_0] w-[350px]" placeholder="Iput Title..." type="text" />
            {content ? <Editor content={content} setcontent={setcontent} setinputfile={setinputfile} setisload={setisloadeditor}/>:<p className="mt-[50px] text-center">Loading...</p>}
            {isloadeditor ? 
                (waitcreate ? 
                    <button type="button" className="bg-[#4e8df1ad] text-[#fff] inline-block p-[10px_1.5rem] font-bold rounded-[8px] mt-[10px] w-[160px] cursor-pointer">Wait...</button>
                    :
                    <button onClick={() => createNithan()} type="button" className="bg-[#4e8cf1] text-[#fff] inline-block p-[10px_1.5rem] font-bold rounded-[8px] mt-[10px] w-[160px] cursor-pointer">Create Nithan</button>)
                :
                ""
            }
        </div>
    );
}