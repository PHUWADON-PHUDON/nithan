"use client";
import { useState,useEffect } from "react";
import Link from "next/link";
import { getAllNithan } from "@/app/serveraction/getnithan";

interface NiThanType {
    id:number;
    title:string;
    content:string;
    favorite:number;
    createAt:Date;
}

export default function Managenovel() {
    const [data,setdata] = useState<NiThanType[]>([]);
    const [iswait,setiswait] = useState<boolean>(true);

    useEffect(() => {
        const loaddata = async () => {
            try{
                setiswait(true);
                const res:NiThanType[] = await getAllNithan() as NiThanType[];
                setdata(res);
                setiswait(false);
            }
            catch(err) {
                console.log(err);
            }
        }

        loaddata();
    },[]);
    
    return(
        <div className="p-[20px]">
            <h1 className="text-[50px] font-bold">Nithan</h1>
            {iswait ? 
                <p className="mt-[50pd] text-center">Loading...</p>
                :
                <>
                    <table className="w-full mt-[20px]">
                        <thead>
                            <tr>
                                <th className="w-1/2">Title</th>
                                <th className="w-1/2">Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((e:any,i:number) => (
                                <tr key={i}>
                                    <td className="text-center p-[20px]"><Link href={`/admin/viewnithan/${e.id}`} className="font-bold text-[#4988f0]">{e.title}</Link></td>
                                    <td className="text-center p-[20px]">
                                        <Link href={`/admin/editnithan/${e.id}`} className="mr-[20px] font-bold text-[#f1c013]">Edit</Link>
                                        <Link href={""} className="font-bold text-[#fd0033]">Delete</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link href={"/admin/createnithan"} className="bg-[#4e8cf1] text-[#fff] inline-block p-[10px_1.5rem] font-bold rounded-[8px] mt-[50px]">Create Nithan</Link>
                </>
            }
        </div>
    );
}