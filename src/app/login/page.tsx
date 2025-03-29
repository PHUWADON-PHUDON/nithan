"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Login() {
    const [inputgmail,setinputinputgmail] = useState<string>("");
    const [inputpassword,setinputpassword] = useState<string>("");
    const router = useRouter();

    const signin = async () => {
        try{
            if (inputgmail !== "" && inputpassword !== "") {
                const res = await axios.post("/api/auth/signin",{gmail:inputgmail,password:inputpassword});
                if (res.status === 200) {
                    router.back();
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    return(
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] shadow-[0_0_8px_#949494] flex flex-col p-[30px] rounded-[20px] items-center">
            <h1 className="text-[30px]">Nithan</h1>
            <input className="h-[35px] w-[250px] rounded-[20px] bg-[#f2f2f2] focus:outline-none pl-[10px] mt-[20px]" type="text" onChange={(e) => setinputinputgmail(e.target.value)} placeholder="Gmail" />
            <input className="h-[35px] w-[250px] rounded-[20px] bg-[#f2f2f2] focus:outline-none pl-[10px] mt-[20px]" type="text" onChange={(e) => setinputpassword(e.target.value)} placeholder="Password" />
            <button onClick={() => signin()} className="flex items-center gap-[10px] bg-[#ff4550] text-white h-[35px] rounded-[20px] p-[0_10px] text-[16px] cursor-pointer mt-[20px]">
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                <p>Sign In</p>
            </button>
            <hr className="w-[80%] h-[1px] bg-[#f2f2f2] border-none mt-[10px]" />
            <Link href={""} className="text-[15px]">or <span className="text-[#ff4550] underline">Sign Up</span></Link>
        </div>
    );
}