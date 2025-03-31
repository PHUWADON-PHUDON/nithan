"use client";
import { useEffect, useState,useContext } from "react";
import { useRouter } from "next/navigation";
import { userpovider } from "@/components/Userpovider";
import Link from "next/link";
import axios from "axios";

interface CheckinputType {
    username:boolean;
    gmail:boolean;
}

export default function Signup() {
    const [inputusername,setinputusername] = useState<string>("");
    const [inputgmail,setinputgmail] = useState<string>("");
    const [inputpassword,setinputpassword] = useState<string>("");
    const [inputconfirmpassword,setinputconfirmpassword] = useState<string>("");
    const [checkinput,setcheckinput] = useState({username:false,gmail:false,password:false,confirmpassword:false,gmailpattern:false,passwordlimit:false,confirmpasswordvalid:false});
    const [checkgmailerr,setcheckgmailerr] = useState<boolean>(false);
    const [waitsignup,setwaitsignup] = useState<boolean>(false);
    const router = useRouter();
    const  userpovider_:any = useContext(userpovider);
    

    //!check input

    const checkInput = () => {
        inputusername === "" ? setcheckinput(prev => {return {...prev,username:true}}):setcheckinput(prev => {return {...prev,username:false}});
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        regex.test(inputgmail) ? setcheckinput(prev => {return {...prev,gmailpattern:false}}):setcheckinput(prev => {return {...prev,gmailpattern:true}});

        if (inputgmail === "") {
            setcheckinput(prev => {return {...prev,gmail:true}});
            setcheckinput(prev => {return {...prev,gmailpattern:false}})
        }
        else {
            setcheckinput(prev => {return {...prev,gmail:false}});
        }

        inputpassword.length < 8 ? setcheckinput(prev => {return {...prev,passwordlimit:true}}):setcheckinput(prev => {return {...prev,passwordlimit:false}});

        if (inputpassword === "") {
            setcheckinput(prev => {return {...prev,password:true}});
            setcheckinput(prev => {return {...prev,passwordlimit:false}})
        }
        else {
            setcheckinput(prev => {return {...prev,password:false}});
        }

        if (inputpassword === inputconfirmpassword) {
            setcheckinput(prev => {return {...prev,confirmpasswordvalid:false}});
       }
       else {
            setcheckinput(prev => {return {...prev,confirmpasswordvalid:true}});
       }

        if (inputconfirmpassword === "") {
            setcheckinput(prev => {return {...prev,confirmpassword:true}});
            setcheckinput(prev => {return {...prev,confirmpasswordvalid:false}});
        }

       if (inputconfirmpassword !== "") {
            setcheckinput(prev => {return {...prev,confirmpassword:false}});
       }
    }

    //!
    
    //!signup

    const signUp = () => {
        checkInput();
    }

    useEffect(() => {
        const signUpNow = async () => {
            if (checkinput.username === false && checkinput.gmail === false &&
                checkinput.password === false && checkinput.confirmpassword === false &&
                checkinput.gmailpattern === false && checkinput.passwordlimit === false &&
                checkinput.confirmpasswordvalid === false
            ) {
                if (inputusername !== "" && inputgmail !== "" && inputpassword !== "" && inputconfirmpassword !== "") {
                    try{
                        setcheckgmailerr(false);
                        setwaitsignup(true);
                        const res = await axios.post("/api/auth/signup",{name:inputusername,gmail:inputgmail,password:inputpassword});
                        if (res.status === 200) {
                            
                            const res2 = await axios.get("/api/verifytoken");
                            if (res.status === 200) {
                                userpovider_.setchecksignin((prev:boolean) => !prev);
                                router.replace("/");
                                setwaitsignup(false);
                            }
                        }
                    }
                    catch(err) {
                        setcheckgmailerr(true);
                        setwaitsignup(false);
                        console.log(err);
                    }
                }
            }
        }

        signUpNow();
    },[checkinput]);

    //!

    return(
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] shadow-[0_0_8px_#949494] flex flex-col p-[30px] rounded-[20px] items-center">
            <h1 className="text-[30px]">Nithan</h1>
            <input className="h-[35px] w-[250px] rounded-[20px] bg-[#f2f2f2] focus:outline-none pl-[10px] mt-[20px]" type="text" onChange={(e) => setinputusername(e.target.value)} placeholder="Username" />
            {checkinput.username ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">input username!</p>:""}
            <input className="h-[35px] w-[250px] rounded-[20px] bg-[#f2f2f2] focus:outline-none pl-[10px] mt-[20px]" type="text" onChange={(e) => setinputgmail(e.target.value)} placeholder="Gmail" />
            {checkinput.gmail ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">input your gmail!</p>:""}
            {checkinput.gmailpattern ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">invalid gmail!</p>:""}
            {checkgmailerr ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">this gmail has already been used!</p>:""}
            <input className="h-[35px] w-[250px] rounded-[20px] bg-[#f2f2f2] focus:outline-none pl-[10px] mt-[20px]" type="password" onChange={(e) => setinputpassword(e.target.value)} placeholder="Password" />
            {checkinput.password ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">input your password!</p>:""}
            {checkinput.passwordlimit ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">minimum 8 characters!</p>:""}
            <input className="h-[35px] w-[250px] rounded-[20px] bg-[#f2f2f2] focus:outline-none pl-[10px] mt-[20px]" type="password" onChange={(e) => setinputconfirmpassword(e.target.value)} placeholder="Confirm Password" />
            {checkinput.confirmpassword ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">input your password again!</p>:""}
            {checkinput.confirmpasswordvalid ? <p className="text-[#ff0033] text-[12px] self-baseline ml-[10px]">invalid confirm password!</p>:""}
            <button onClick={() => signUp()} className="flex items-center gap-[10px] bg-[#ff4550] text-white h-[35px] rounded-[20px] p-[0_10px] text-[16px] cursor-pointer mt-[20px]">
                {waitsignup ? 
                    <p className="aniwaitautosignin w-[20px] h-[20px] border-[3px] border-white rounded-[100%] border-r-transparent"></p>
                    :
                    <>
                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                    <p>Sign Up</p>
                    </>
                }
            </button>
            <hr className="w-[80%] h-[1px] bg-[#f2f2f2] border-none mt-[10px]" />
            <Link href={"/signin"} className="text-[15px]">or <span className="text-[#ff4550] underline">Sign In</span></Link>
        </div>
    );
}