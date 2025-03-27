"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
const Editor = dynamic(() => import("@/components/Editor"),{ssr:false,loading:() => <p className="mt-[50px] text-center">Loading...</p>});

interface ImageFileType {
    file:File;
    blob:string;
}

export default function Createnithan() {
    const [inputtitle,setinputtitle] = useState<string>("");
    const [content,setcontent] = useState<string>("<p>Write Now...</p>");
    const [inputfile,setinputfile] = useState<ImageFileType[]>([]);
    const [isloadeditor,setisloadeditor] = useState<boolean>(false);
    const [waitcreate,setwaitcreate] = useState<boolean>(false);
    const router = useRouter();

    //!create post

    const createNithan = async () => {
        const abortcontroller:AbortController = new AbortController();

        if (inputtitle !== "" && content !== "") {
            try{
                const newinputfile:ImageFileType[] = inputfile.filter((e:ImageFileType) => {
                    if (content.includes(e.blob)) {
                        return(e);
                    }
                });

                const formdata = new FormData();
                formdata.append("title",inputtitle);
                formdata.append("content",content);
                newinputfile.forEach((file:ImageFileType) => {
                    formdata.append("images",file.file);
                    formdata.append("blobs",file.blob);
                });

                setwaitcreate(true);
                const response = await axios.post("/api/createnithan",formdata,{headers:{'content-type':'multipart/form-data'},signal:abortcontroller.signal});
                if (response.status === 200) {
                    router.push("/admin/managenithan?page=1");
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        return () => abortcontroller.abort();
    };

    //!

    return(
        <div className="p-[20px] h-[100dvh] flex flex-col">
            <h1 className="font-bold text-[40px]">Create Nithan</h1>
            <input onChange={(e) => setinputtitle(e.target.value)} className="border-b border-gray-400 m-[10px_0] w-[350px]" placeholder="Iput Title..." type="text" />
            <Editor content={content} setcontent={setcontent} setinputfile={setinputfile} setisload={setisloadeditor}/>
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