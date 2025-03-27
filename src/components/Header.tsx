"use client";
import { useState,useEffect } from "react";
import { searchNithan } from "@/app/serveraction/getnithan";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

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

export default function Header() {
    const [inputsearch,setinputsearch] = useState<string>("");
    const [listsearch,setlistsearch] = useState<NiThanType[]>([]);
    const router = useRouter();

    //!search nithan

    useEffect(() => {
        const abortcontroller = new AbortController();

        const searchNow = async () => {
            if (inputsearch === "") {
                setlistsearch([]);
            }
            else {
                try{
                    const res = await axios.post("/api/searchnithan",{value:inputsearch},{signal:abortcontroller.signal});
                    if (res.status === 200) {
                        setlistsearch(res.data);
                    }
                }
                catch(err) {
                    console.log(err);
                }
            }
        }

        searchNow();

        return () => abortcontroller.abort();
    },[inputsearch]);

    //!

    //!click search
    
    const clickSearch = () => {
        if (inputsearch !== "") {
            router.push(`/search?search=${inputsearch}&page=1`);
            setinputsearch("");
        }
    } 
    
    //!
    
    return(
        <div className="w-[100%] sticky top-0 z-10 bg-white @container">
            <div className="max-w-[1024px] h-[80px] m-[0_auto]">
                <div className="h-[100%] flex items-center justify-between">
                    <div>
                        <h1 onClick={() => router.push("/")} className="font-bold text-[25px] cursor-pointer">Nithan</h1>
                    </div>
                    <div className="flex @max-[470px]:hidden">
                        <input type="" onChange={(e) => setinputsearch(e.target.value)} className="bg-[#0000000d] p-[5px_10px] focus:outline-none rounded-[20px_0_0_20px] w-[200px] h-[35px]" placeholder="Search..."/>
                        <div className="bg-[#0000000d] w-[35px] flex items-center justify-center rounded-[0_20px_20px_0]">
                            <i onClick={() => clickSearch()} className="fa-solid fa-magnifying-glass cursor-pointer"></i>
                        </div>
                    </div>
                </div>
            </div>
            {listsearch.length > 0 ? 
                <div className="absolute right-0 w-[235px] bg-[#f2f2f2] p-[10px] rounded-[10px] max-h-[300px] overflow-y-scroll">
                    {listsearch.map((e,i) => (
                        <Link key={i} href={`/search?search=${e.title}&page=1`} onClick={() =>  setinputsearch("")} className="block">{e.title}</Link>
                    ))}
                </div>
                :
                ""
            }
        </div>
    );
}