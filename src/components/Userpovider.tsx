"use client";
import { createContext, useState } from "react";

export const userpovider = createContext<any>(null);

export default function Userpovider({ children }:any) {
    const [checksignin,setchecksignin] = useState<boolean>(false);

    return(
        <userpovider.Provider value={{checksignin:checksignin,setchecksignin:setchecksignin}}>
            {children}
        </userpovider.Provider>
    );
}