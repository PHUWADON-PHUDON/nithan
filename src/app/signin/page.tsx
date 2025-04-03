"use client";
import { useState,useContext } from "react";
import { useRouter } from "next/navigation";
import { userpovider } from "@/components/Userpovider";
import { darkmodeprovider } from "@/components/Darkmodeprovider";
import Link from "next/link";
import axios from "axios";

interface CheckinputType {
    gmail:boolean;
    password:boolean;
    invalid:boolean;
}

export default function Login() {
    const [inputgmail,setinputinputgmail] = useState<string>("");
    const [inputpassword,setinputpassword] = useState<string>("");
    const [checkinput,setcheckinput] = useState<CheckinputType>({gmail:false,password:false,invalid:false});
    const [waitsignin,setwaitsignin] = useState<boolean>(false);
    const router = useRouter();
    const {setchecksignin} = useContext(userpovider);
    const darkmodeprovider_ = useContext(darkmodeprovider);

    const signin = async () => {
        try{
            setcheckinput(prev => {return {...prev,invalid:false}});

            if (inputgmail === "") {
                setcheckinput(prev => {return {...prev,gmail:true}});
            }
            else {
                setcheckinput(prev => {return {...prev,gmail:false}});
            }

            if (inputpassword === "") {
                setcheckinput(prev => {return {...prev,password:true}});
            }
            else {
                setcheckinput(prev => {return {...prev,password:false}});
            }

            if (inputgmail !== "" && inputpassword !== "") {
                setwaitsignin(true);
                const res = await axios.post("/api/auth/signin",{gmail:inputgmail,password:inputpassword});
                if (res.status === 200) {
                    setchecksignin(true);
                    setwaitsignin(false);
                    router.back();
                }
            }
        }
        catch(err) {
            setwaitsignin(false);
            setcheckinput(prev => {return {...prev,invalid:true}});
            console.log(err);
        }
    }

    return(
        <div style={darkmodeprovider_.isdark ? {backgroundColor:"#000",color:"#fff"}:{backgroundColor:"#fff",color:"#000"}} className="w-full h-full p-[0_20px]">
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] shadow-[0_0_8px_#949494] flex flex-col p-[30px] rounded-[20px] items-center">
                <h1 className="text-[30px]">Nithan</h1>
                <input style={darkmodeprovider_.isdark ? {backgroundColor:"#2e2e2e"}:{backgroundColor:"#0000000d"}} className="h-[35px] w-[250px] rounded-[20px] focus:outline-none pl-[10px] mt-[20px]" type="email" onChange={(e) => setinputinputgmail(e.target.value)} placeholder="Gmail" />
                {checkinput.gmail ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">input your gmail!</p>:""}
                <input style={darkmodeprovider_.isdark ? {backgroundColor:"#2e2e2e"}:{backgroundColor:"#0000000d"}} className="h-[35px] w-[250px] rounded-[20px] focus:outline-none pl-[10px] mt-[20px]" type="password" onChange={(e) => setinputpassword(e.target.value)} placeholder="Password" />
                {checkinput.password ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">input your password!</p>:""}
                {checkinput.invalid ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">invalid gmail or password!</p>:""}
                <button onClick={() => signin()} className="flex items-center gap-[10px] bg-[#ff4550] text-white h-[35px] rounded-[20px] p-[0_10px] text-[16px] cursor-pointer mt-[20px]">
                    {waitsignin ? 
                        <p className="aniwaitautosignin w-[20px] h-[20px] border-[3px] border-white rounded-[100%] border-r-transparent"></p>
                        :
                        <>
                        <i className="fa-solid fa-arrow-right-to-bracket"></i>
                        <p>Sign In</p>
                        </>
                    }
                </button>
                <hr className="w-[80%] h-[1px] bg-[#f2f2f2] border-none mt-[10px]" />
                <Link href={"/signup"} className="text-[15px]">or <span className="text-[#ff4550] underline">Sign Up</span></Link>
            </div>
        </div>
    );
}