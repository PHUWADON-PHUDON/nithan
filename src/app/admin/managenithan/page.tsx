"use client";
import { useState,useEffect } from "react";
import { getAllNithan } from "@/app/serveraction/getnithan";
import { deleteNithan } from "@/app/serveraction/deletenithan";
import Link from "next/link";
import { error } from "console";

interface NiThanType {
    id:number;
    title:string;
    content:string | null;
    favorite:number | null;
    createAt:Date;
}

export default function Managenovel() {
    const [data,setdata] = useState<NiThanType[]>([]);
    const [iswait,setiswait] = useState<boolean>(true);

    //!load data

    const loaddata = async () => {
        try{
            setiswait(true);
            const res:{nithan:NiThanType[],status:number} | null = await getAllNithan() as {nithan:NiThanType[],status:number} | null;
            if (res!.status === 200) {
                setdata(res!.nithan);
                setiswait(false);
            }
            else {
                alert("เกิดข้อผิดพลาด");
                window.location.reload();
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loaddata();
    },[]);

    //!

    //!delete nithan

    const deleteNithan_ = async (id:number,name:string) => {
        try{
            const confirmdelete = confirm("ต้องการลบ " + name + " ใช่หรือไม่");
            if (confirmdelete) {
                setiswait(true);
                const res = await deleteNithan(id);
                if (res.status === 200) {
                    loaddata();
                }
                else {
                    throw new Error();
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    //!
    
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
                                        <button onClick={() => deleteNithan_(e.id,e.title)} type="button" className="font-bold text-[#fd0033] cursor-pointer">Delete</button>
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