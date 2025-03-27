"use client";
import { useState,useEffect } from "react";
import { getAllNithan } from "@/app/serveraction/getnithan";
import { deleteNithan } from "@/app/serveraction/deletenithan";
import { useRouter,useSearchParams } from "next/navigation";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import axios from "axios";

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
    const [countnithan,setcountnithan] = useState<number>(1);
    const router = useRouter();
    const searchparam = useSearchParams();

    //!load data

    const loaddata = async () => {
        const abortcontroller = new AbortController();

        try{
            setiswait(true);
            const res = await axios.get(`/api/getnithan?page=${searchparam.get("page")}`,{signal:abortcontroller.signal});
            if (res.status === 200) {
                setdata(res.data.nithan);
                setcountnithan(res.data.countnithan);
                setiswait(false);
            }
        }
        catch(err) {
            console.log(err);
        }

        return () => abortcontroller.abort();
    }

    useEffect(() => {
        loaddata();
    },[searchparam]);

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

    //!change page

    const changePage = (event:any) => {
        router.push(`/admin/managenithan?page=${event.selected + 1}`);
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
                    <div className="flex justify-center mt-[30px]">
                        <ReactPaginate
                            previousLabel={false}
                            nextLabel={false}
                            breakLabel={'...'}
                            pageCount={Math.ceil(countnithan / 5)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={changePage}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            forcePage={Number(searchparam.get("page")) - 1}
                        />
                    </div>
                    <Link href={"/admin/createnithan"} className="bg-[#4e8cf1] text-[#fff] inline-block p-[10px_1.5rem] font-bold rounded-[8px] mt-[30px]">Create Nithan</Link>
                </>
            }
        </div>
    );
}