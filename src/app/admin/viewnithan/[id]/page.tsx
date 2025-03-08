"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
    const param = useParams();

    useEffect(() => {
        const abortcontroller = new AbortController();

        const loadcontent = async () => {
            try{
                const response = await axios.get("/api/getnithan/" + param.id ,{signal:abortcontroller.signal});
                if (response.status === 200) {
                    setcontent(response.data);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        loadcontent();

        return () => abortcontroller.abort();
    },[]);

    return(
        <div className="max-w-[1024px] m-[0_auto] h-full overflow-scroll p-[50px_0]">
            {content ? 
                <>
                <h1 className="text-center font-bold text-[20px]">{content.title}</h1>
                <div className="contentview pt-[50px]" dangerouslySetInnerHTML={{ __html: content.content }} />
                </>
                :
                <p className="text-center">Loading...</p>
            }
        </div>
    );
}