"use client";
import { useState,useEffect,createContext } from "react";

export const darkmodeprovider = createContext<any>(null);

export default function Darkmodeprovider({ children }:any) {
    const [isdark,setisdark] = useState<boolean>(false);

    useEffect(() => {
        if (isdark) {
            window.document.body.style.backgroundColor = "#000";
        }
        else {
            window.document.body.style.backgroundColor = "#fff";
        }
    },[isdark]);

    return(
        <darkmodeprovider.Provider value={{isdark:isdark,setisdark:setisdark}}>
            {children}
        </darkmodeprovider.Provider>
    );
}