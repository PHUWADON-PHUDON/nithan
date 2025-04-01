"use client";
import { useState,useEffect } from "react";
import { getNithanHome } from "./serveraction/getnithan";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Link from "next/link";
import axios from "axios";

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

export default function Home() {
  const [content,setcontent] = useState<NiThanType[]>([]);
  
  //!load data

  useEffect(() => {
    const loadData = async () => {
      const res:{nithan:NiThanType[],status:number} | null = await getNithanHome() as {nithan:NiThanType[],status:number} | null;
      if (res?.status === 200) {
        setcontent(res.nithan);
      }
    }

    loadData();
  },[]);

  //!

  return (
    <div className="max-w-[1024px] h-[90dvh] m-[0_auto] flex flex-col">
      {/* <Header/> */}
      {content.length > 0 ? 
        <div className="grow overflow-y-scroll p-[0_0_20px_0]">
          <div className="">
            <div className="relative">
              {content[0]?.images.length > 0 ? 
                <img src={content[0]?.images[0].imageurl} alt="" className="h-[70dvh] w-[100%] object-cover rounded-4xl brightness-80" loading="lazy"/>
                :
                <img className="h-[70dvh] w-[100%] object-cover rounded-4xl brightness-80" src="https://plus.unsplash.com/premium_photo-1687996107376-20005edd18fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" loading="lazy"/>
              }
              <div className="absolute left-[50%] bottom-[100px] translate-x-[-50%] w-[100%] p-[0_20px]">
                <h1 className="text-white text-[50px] mb-[10px] font-bold text-center  @max-[450px]:text-[40px] @max-[350px]:text-[30px]">{content[0]?.title}</h1>
                <Link href={`/viewnithan?id=${content[0]?.id}`} className="bg-[#ff4550] text-white p-[5px_50px] font-bold rounded-4xl mt-[20px] cursor-pointer block w-[137px] m-[0_auto]">Read</Link>
              </div>
            </div>
            <div className="mt-[20px] flex gap-[20px] flex-wrap justify-center">
              {content.map((e:NiThanType,i:number) => (
                (i > 0 ? 
                  <Link key={i} href={`/viewnithan?id=${e.id}`} className="boxitem">
                    <div className="h-[180px] overflow-hidden rounded-2xl w-[250px] relative @max-[575px]:w-[350px] @max-[350px]:w-[250px]">
                      {e.images.length > 0 ? 
                        <img src={e.images[0].imageurl} alt="" className="object-cover h-[100%] w-[100%]" loading="lazy"/>
                        :
                        <img className="object-cover h-[100%] w-[100%]" src="https://plus.unsplash.com/premium_photo-1687996107376-20005edd18fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" loading="lazy"/>
                      }
                      <div className="absolute z-20 left-[0] bottom-[0] w-[100%] h-[50px] bg-linear-[180deg,transparent,#000_95%] text-white flex items-center p-[0_10px]">{e.title}</div>
                    </div>
                  </Link>
                  :
                  ""
                )
              ))}
            </div>
          </div>
        </div>
        :
        <p className="mt-[50px] text-center">Loading...</p>
      }
    </div>
  );
}