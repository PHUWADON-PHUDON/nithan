import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import axios from "axios";

const prisma = new PrismaClient();

export default async function Managenovel() {
    const nithan = await prisma.nithan.findMany();
    
    return(
        <div className="p-[20px]">
            <h1 className="text-[50px] font-bold">Nithan</h1>
            <table className="w-full mt-[20px]">
                <thead>
                    <tr>
                        <th className="w-1/2">Title</th>
                        <th className="w-1/2">Option</th>
                    </tr>
                </thead>
                <tbody>
                    {nithan.map((e,i:number) => (
                        <tr key={i}>
                            <td className="text-center p-[20px]"><Link href={`/admin/viewnithan/${e.id}`} className="font-bold text-[#4988f0]">{e.title}</Link></td>
                            <td className="text-center p-[20px]">
                                <Link href={""} className="mr-[20px] font-bold text-[#f1c013]">Edit</Link>
                                <Link href={""} className="font-bold text-[#fd0033]">Delete</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link href={"/admin/createnithan"} className="bg-[#4e8cf1] text-[#fff] inline-block p-[10px_1.5rem] font-bold rounded-[8px] mt-[50px]">Create Nithan</Link>
        </div>
    );
}