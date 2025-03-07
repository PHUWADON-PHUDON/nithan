"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Admin() {
    const [inputlogin,setinputlogin] = useState<string>("");
    const router = useRouter();
    const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";
    
    const login = (inputpassword:string) => {
        if (inputpassword === password && inputpassword !== "") {
            Cookies.set("login","true",{expires:1});
            router.push("/admin/managenithan");
        }
    }

    return(
        <div className="border h-[100dvh] flex justify-center items-center flex-col">
            <h1 className="text-[50px] font-bold text-center">Phuwadon.Ni Than Login</h1>
            <div className="mt-[20px]">
                <input onChange={(e) => setinputlogin(e.target.value)} className="border-b focus:outline-none" type="text" placeholder="Password" />
                <button onClick={() => login(inputlogin)} className="ml-[20px] bg-[#ff4550] text-white p-[0_20px] rounded-4xl font-bold">Login</button>
            </div>
        </div>
    );
}