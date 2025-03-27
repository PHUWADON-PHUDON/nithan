"use client";
import { useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import axios from "axios";

interface ContentType {
    content: string;
    id: number;
    title: string;
    favorite: number;
    createAt: Date;
}

export default function Viewnithan() {
    const [content,setcontent] = useState<ContentType>();
    const [wait,setwait] = useState<boolean>(true);
    const searchparam = useSearchParams();

    //!load data

    useEffect(() => {
        const abortcontroller = new AbortController();
        const nithanid = searchparam.get("id");

        const loaddata = async () => {
            try{
                if (!isNaN(Number(nithanid))) {
                    setwait(true);
                    const res = await axios.get(`/api/getnithanuser?id=${nithanid}`,{signal:abortcontroller.signal});
                    if (res.status === 200) {
                        setcontent(res.data);
                        setwait(false);
                    }
                }
                else {
                    setwait(false);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        loaddata();

        return () => abortcontroller.abort();
    },[]);

    //!

    return(
        <div className="overflow-y-scroll max-w-[1024px] h-[100%] m-[0_auto]">
            <Header/>
            {!wait ? 
                (content ? 
                    <>
                    <h1 className="text-center font-bold text-[20px]">{content.title}</h1>
                    <div className="contentview pt-[50px]" dangerouslySetInnerHTML={{ __html: content.content  }} />
                    </>
                    :
                    <h2 className="text-[40px] text-gray-300">Not Found :(</h2>
                )
                :
                <p className="text-center">Loading...</p>
            }
        </div>
    );
}