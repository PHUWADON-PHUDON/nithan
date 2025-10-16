"use client";
import {useState,useEffect,useCallback,useRef,useContext} from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { darkmodeprovider } from "@/components/Darkmodeprovider";
import Header from "@/components/Header";
import axios from "axios";
import Cookies from "js-cookie";
import Jwt from "jsonwebtoken";

interface ContentType {
    content: string;
    id: number;
    title: string;
    favorite: number;
    createAt: Date;
}

interface TokenType {
    exp:number;
    gmail:string;
    iat:number;
    id:number;
    name:string;
}

export default function Viewnithan() {
    const [content,setcontent] = useState<ContentType>();
    const [wait,setwait] = useState<boolean>(true);
    const [islove,setislove] = useState<boolean>(false);
    const [countfav,setcountfav] = useState<number>(0);
    const abortcontrollerref = useRef<AbortController>(null);
    const searchparam = useSearchParams();
    const router = useRouter();
    const darkmodeprovider_ = useContext(darkmodeprovider);
    const nithanid = searchparam.get("id");

    //!load data

    useEffect(() => {
        const abortcontroller = new AbortController();

        const loaddata = async () => {
            try{
                if (!isNaN(Number(nithanid))) {
                    setwait(true);
                    //const res = await axios.get(`/api/getnithanuser?id=${nithanid}`,{signal:abortcontroller.signal});
                    const res = await fetch(`/api/getnithanuser?id=${nithanid}`,{next:{revalidate:3600}});
                    const resdata = await res.json();
                    if (res.status === 200) {
                        const token = Cookies.get("token");

                        if (token) {
                            const decode:TokenType | null = Jwt.decode(token) as TokenType | null;
                            const love = resdata.favorites.some((e:any) => decode?.id === e.userid);

                            if (love) {
                                setislove(true);
                            }
                            else {
                                setislove(false);
                            }
                        }
                       
                        setcontent(resdata);
                        setwait(false);
                        setcountfav(resdata.favorites.length);
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

    //!love this nithan

    const loveNithan = useCallback(async () => {
        if (abortcontrollerref.current) {
            abortcontrollerref.current.abort();
        }
        
        abortcontrollerref.current = new AbortController();

        try{
            const token = Cookies.get("token");

            if (token) {
                if (!islove) {
                    setislove(true);
                    setcountfav((prev) => prev + 1);
                }
                else {
                    setislove(false);
                    setcountfav((prev) => prev - 1);
                }

                const res = await axios.get("/api/verifytoken",{signal:abortcontrollerref.current.signal});
                if (res.status === 200) {
                    if (res.data.token) {
                        if (!islove) {
                            const res2 = await axios.post("/api/lovenithan",{userid:res.data.id,nithanid:nithanid,islove:true});
                        }
                        else {
                            const res3 = await axios.post("/api/lovenithan",{userid:res.data.id,nithanid:nithanid,islove:false});
                        }
                    }
                    else {
                        router.push("/signin");
                    }
                }
            }
            else {
                router.push("/signin");
            }
        }
        catch(err) {
            console.log(err);
        }
    },[islove]);

    //!

    return(
        <div style={darkmodeprovider_.isdark ? {backgroundColor:"#000",color:"#fff"}:{backgroundColor:"#fff",color:"#000"}} className="w-full h-full p-[0_20px]">
            <div className="overflow-y-scroll max-w-[1024px] h-[90dvh] m-[0_auto] p-[30px_0]">
                {/* <Header/> */}
                {!wait ? 
                    (content ? 
                        <>
                        <h1 className="text-center font-bold text-[20px]">{content.title}</h1>
                        <div className="contentview pt-[50px]" dangerouslySetInnerHTML={{ __html: content.content  }} />
                        {islove ? 
                            <div onClick={() => loveNithan()} className="absolute right-[50px] bottom-[50px] flex flex-col items-center cursor-pointer text-[#ff4550]">
                                <i className="fa-solid fa-heart text-[30px]"></i>
                                <p>{countfav}</p>
                            </div>
                            :
                            <div style={darkmodeprovider_.isdark ? {color:"#fff"}:{color:"#000"}} onClick={() => loveNithan()} className="absolute right-[50px] bottom-[50px] flex flex-col items-center cursor-pointer text-[#000]">
                                <i className="fa-solid fa-heart text-[30px]"></i>
                                <p>{countfav}</p>
                            </div>
                        }
                        </>
                        :
                        <h2 className="text-[40px] text-gray-300">Not Found :(</h2>
                    )
                    :
                    <p className="text-center">Loading...</p>
                }
            </div>
        </div>
    );
}