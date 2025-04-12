"use client";
import { useState,useEffect,useContext } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { userpovider } from "./Userpovider";
import { darkmodeprovider } from "./Darkmodeprovider";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

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

interface VerifyType {
    token:boolean;
    name:string;
}

export default function Header() {
    const [inputsearch,setinputsearch] = useState<string>("");
    const [listsearch,setlistsearch] = useState<NiThanType[]>([]);
    const [verify,setverify] = useState<VerifyType>();
    const [waitautosignin,setwaitautosignin] = useState<boolean>(true);
    const [isclickmenu,setisclickmenu] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const userpovider_ = useContext(userpovider);
    const darkmodeprovider_ = useContext(darkmodeprovider);
    const hideurl = ["/signin","/signup","/admin","/admin/managenithan","/admin/viewnithan","/admin/editnithan","/admin/createnithan"];

    //!verify

    useEffect(() => {
        const autosignin = async () => {
            try{
                setwaitautosignin(true);
                const res = await axios.get("/api/verifytoken");
                if (res.status === 200) {
                  setverify(res.data);
                  setwaitautosignin(false);
                  setisclickmenu(false);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        autosignin();
    },[userpovider_.checksignin]);

    //!

    //!search nithan

    //?wait update
    // useEffect(() => {
    //     const abortcontroller = new AbortController();

    //     const searchNow = async () => {
    //         if (inputsearch === "") {
    //             setlistsearch([]);
    //         }
    //         else {
    //             try{
    //                 const res = await axios.post("/api/searchnithan",{value:inputsearch},{signal:abortcontroller.signal});
    //                 if (res.status === 200) {
    //                     setlistsearch(res.data);
    //                 }
    //             }
    //             catch(err) {
    //                 console.log(err);
    //             }
    //         }
    //     }

    //     searchNow();

    //     return () => abortcontroller.abort();
    // },[inputsearch]);

    //!

    //!click search
    
    const clickSearch = () => {
        if (inputsearch !== "") {
            router.push(`/search?search=${inputsearch}&page=1`);
            setinputsearch("");
        }
    } 
    
    //!

    //!hide header

    const hideHeader = hideurl.some(route => pathname.startsWith(route));

    if (hideHeader) {
        return null;
    }

    //!

    //!click menue

    const clickMenu = () => {
        setisclickmenu(!isclickmenu);
    }

    //!

    //!logout

    const logout = () => {
        Cookies.remove("token");
        window.location.reload();
    }

    //!

    //!click dark mode

    const darkMode = () => {
        darkmodeprovider_.setisdark((prev:boolean) => !prev);
    }

    //!
    
    return(
        <div style={darkmodeprovider_.isdark ? {backgroundColor:"#000",color:"#fff"}:{backgroundColor:"#fff",color:"#000"}} className="w-[100%] sticky top-0 z-10 p-[0_20px] @container">
            <div className="max-w-[1024px] h-[80px] m-[0_auto] relative">
                <div className="h-[100%] flex items-center justify-between">
                    <div className="flex items-center gap-[20px]">
                        <h1 onClick={() => router.push("/")} className="font-bold text-[25px] cursor-pointer">Nithan</h1>
                        <Link href={"/allnithan?page=1"}>All</Link>
                    </div>
                    <div className="flex @max-[520px]:hidden">
                        <input type="" onChange={(e) => setinputsearch(e.target.value)} value={inputsearch} style={darkmodeprovider_.isdark ? {backgroundColor:"#2e2e2e"}:{backgroundColor:"#0000000d"}} className="p-[5px_10px] focus:outline-none rounded-[20px_0_0_20px] w-[200px] h-[35px]" placeholder="Search..."/>
                        <div style={darkmodeprovider_.isdark ? {backgroundColor:"#2e2e2e"}:{backgroundColor:"#0000000d"}} className="w-[35px] flex items-center justify-center rounded-[0_20px_20px_0]">
                            <i onClick={() => clickSearch()} className="fa-solid fa-magnifying-glass cursor-pointer hover:text-[#ff4550]"></i>
                        </div>
                        {verify?.token ? 
                            <div className="flex items-center h-[35px] p-[0_10px] ml-[20px] text-[16px]">
                                <p>Hello <span className="text-[#ff4550]">{verify?.name}</span></p>
                                <i onClick={() => logout()} className="fa-solid fa-right-from-bracket cursor-pointer ml-[20px] hover:text-[#ff4550]"></i>
                            </div>
                            :
                            <Link href={"/signin"} className="w-[100px] flex items-center justify-center gap-[10px] bg-[#ff4550] text-white h-[35px] rounded-[20px] p-[0_10px] ml-[20px] text-[16px] cursor-pointer">
                                {waitautosignin ? 
                                    <p className="aniwaitautosignin w-[20px] h-[20px] border-[3px] border-white rounded-[100%] border-r-transparent"></p>
                                    :
                                    <>
                                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                    <p>Sign In</p>
                                    </>
                                }
                            </Link>
                        }
                        <div className="flex items-center">
                            <i onClick={() => darkMode()} className="fa-solid fa-moon cursor-pointer ml-[20px] hover:text-[#ff4550]"></i>
                        </div>
                    </div>
                    <div onClick={() => clickMenu()} className="menuresponsive items-center">
                        {verify?.token ? 
                            <div className="flex items-center h-[35px] p-[0_10px] ml-[20px] text-[16px]">
                                <p>Hello <span className="text-[#ff4550]">{verify?.name}</span></p>
                            </div>
                            :
                            <div></div>
                        }
                        <i className="fa-solid fa-burger cursor-pointer hover:text-[#ff4550]"></i>
                    </div>
                </div>
                {listsearch.length > 0 ? 
                    <div className="absolute right-0 w-[235px] bg-[#f2f2f2] p-[10px] rounded-[10px] max-h-[300px] overflow-y-scroll">
                        {listsearch.map((e,i) => (
                            <Link key={i} href={`/search?search=${e.title}&page=1`} onClick={() =>  setinputsearch("")} className="block">{e.title}</Link>
                        ))}
                    </div>
                    :
                    <p></p>
                }
            </div>
            <div style={isclickmenu ? {height:"auto",padding:"20px 20px"}:{height:"0",padding:"0 20px"}} className={`menu bg-inherit absolute left-0 w-[100%] overflow-hidden flex items-center justify-around flex-wrap gap-[20px]`}>
                <div className="flex">
                    <input type="" onChange={(e) => setinputsearch(e.target.value)} value={inputsearch} style={darkmodeprovider_.isdark ? {backgroundColor:"#2e2e2e"}:{backgroundColor:"#0000000d"}} className="p-[5px_10px] focus:outline-none rounded-[20px_0_0_20px] w-[200px] h-[35px]" placeholder="Search..."/>
                    <div style={darkmodeprovider_.isdark ? {backgroundColor:"#2e2e2e"}:{backgroundColor:"#0000000d"}} className="w-[35px] flex items-center justify-center rounded-[0_20px_20px_0]">
                        <i onClick={() => clickSearch()} className="fa-solid fa-magnifying-glass cursor-pointer hover:text-[#ff4550]"></i>
                    </div>
                </div>
                {verify?.token ? 
                    <div onClick={() => logout()} className="flex items-center gap-[10px] cursor-pointer hover:text-[#ff4550]">
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <p>Logout</p>
                    </div>
                    :
                    <Link href={"/signin"} className="w-[100px] flex items-center justify-center gap-[10px] bg-[#ff4550] text-white h-[35px] rounded-[20px] p-[0_10px] text-[16px] cursor-pointer">
                        {waitautosignin ? 
                            <p className="aniwaitautosignin w-[20px] h-[20px] border-[3px] border-white rounded-[100%] border-r-transparent"></p>
                            :
                            <>
                            <i className="fa-solid fa-arrow-right-to-bracket"></i>
                            <p>Sign In</p>
                            </>
                        }
                    </Link>
                }
                <i onClick={() => darkMode()} className="fa-solid fa-moon cursor-pointer hover:text-[#ff4550]"></i>
            </div>
        </div>
    );
}