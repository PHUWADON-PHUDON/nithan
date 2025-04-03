"use client";
import { useState,useEffect,createContext } from "react";
import Cookies from "js-cookie";

export const darkmodeprovider = createContext<any>(null);

export default function Darkmodeprovider({ children }:any) {
    const [isdark,setisdark] = useState<any>(true);

    return(
        <darkmodeprovider.Provider value={{isdark:isdark,setisdark:setisdark}}>
            {children}
        </darkmodeprovider.Provider>
    );
}