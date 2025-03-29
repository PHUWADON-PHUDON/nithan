"use client";
import { useState,useEffect } from "react";
import { useSearchParams,useRouter } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Link from "next/link";

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

export default function Search() {
    const [countnithan,setcountnithan] = useState<number>(1);
    const [content,setcontent] = useState<NiThanType[]>([]);
    const [wait,setwait] = useState<boolean>(true);
    const searchparam = useSearchParams();
    const router = useRouter();

    //!load data

    useEffect(() => {
        const abortcontroller = new AbortController();

        const loaddata = async () => {
            try{
                setwait(true);
                const res = await axios.get(`/api/searchnithan?search=${searchparam.get("search")}&page=${searchparam.get("page")}`,{signal:abortcontroller.signal});
                if (res.status === 200) {
                    setcountnithan(res.data.countnithan)
                    setcontent(res.data.nithan);
                    setwait(false);

                    console.log(res.data.countnithan);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        loaddata();

        return () => abortcontroller.abort();
    },[searchparam]);

    //!

    //!chonge page

    const changePage = async (event:any) => {
        router.push(`/search?search=${searchparam.get("search")}&page=${event.selected + 1}`);
    }

    //!

    return(
        <div className="overflow-y-scroll max-w-[1024px] h-[100%] m-[0_auto]">
            {/* <Header/> */}
            {!wait ? 
                (content.length > 0 ? 
                    <>
                    <div className="max-w-[1024px] m-[0_auto] flex flex-wrap gap-[10px] justify-center">
                        {content.map((e,i) => (
                            <Link key={i} href={`/viewnithan?id=${e.id}`} className="boxitem">
                                <div className="h-[180px] overflow-hidden rounded-2xl w-[240px] relative @max-[575px]:w-[350px] @max-[350px]:w-[250px]">
                                    {e.images.length > 0 ? 
                                      <img src={e.images[0].imageurl} alt="" className="object-cover h-[100%] w-[100%]" loading="lazy"/>
                                      :
                                      <img className="object-cover h-[100%] w-[100%]" src="https://plus.unsplash.com/premium_photo-1687996107376-20005edd18fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" loading="lazy"/>
                                    }
                                    <div className="absolute z-9 left-[0] bottom-[0] w-[100%] h-[50px] bg-linear-[180deg,transparent,#000_95%] text-white flex items-center p-[0_10px]">{e.title}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex justify-center m-[50px_0]">
                        <ReactPaginate
                            previousLabel={false}
                            nextLabel={false}
                            breakLabel={'...'}
                            pageCount={Math.ceil(countnithan / 12)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={changePage}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            forcePage={Number(searchparam.get("page")) - 1}
                        />
                    </div>
                    </>
                    :
                    <h2 className="text-[40px] text-gray-300">Not Found :(</h2>
                )
                :
                <p className="mt-[50px] text-center">Loading...</p>
            }
        </div>
    );
}