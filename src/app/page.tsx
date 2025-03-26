import { getNithanHome } from "./serveraction/getnithan";
import Header from "@/components/Header";
import Link from "next/link";

interface NiThanType {
  id:number;
  title:string;
  content:string | null;
  favorite:number | null;
  createAt:Date;
}

export default async function Home() {
  const content:{nithan:NiThanType[],status:number} | null = await getNithanHome() as {nithan:NiThanType[],status:number} | null;

  return (
    <div className="max-w-[1024px] h-[100%] m-[0_auto] flex flex-col">
      <Header/>
      <div className="grow overflow-y-scroll p-[0_0_20px_0]">
        <div className="">
          <div className="relative">
            <img className="h-[70dvh] w-[100%] object-cover rounded-4xl brightness-80" src="https://plus.unsplash.com/premium_photo-1687996107376-20005edd18fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            <div className="absolute left-[100px] bottom-[100px] @max-[755px]:left-[50%] @max-[755px]:translate-x-[-50%] @max-[755px]:text-center">
              <h1 className="text-white text-[50px] font-bold">{content!.nithan[0].title}</h1>
              <button className="bg-[#ff4550] text-white p-[5px_50px] font-bold rounded-4xl mt-[20px]">Read</button>
            </div>
          </div>
          <div className="mt-[20px] flex gap-[20px] flex-wrap justify-center">
            {content!.nithan.map((e,i:number) => (
              (i > 0 ? 
                <Link key={i} href={""}>
                  <div className="h-[180px] overflow-hidden rounded-2xl w-[250px] relative @max-[575px]:w-[100%]">
                    <img className="object-cover h-[100%] w-[100%]" src="https://plus.unsplash.com/premium_photo-1687996107376-20005edd18fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
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
    </div>
  );
}