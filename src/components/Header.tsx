export default function Header() {
    return(
        <div className="w-[100%] sticky top-0 z-10 bg-white @container">
            <div className="max-w-[1024px] h-[80px] m-[0_auto]">
                <div className="h-[100%] flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-[25px]">Nithan</h1>
                    </div>
                    <div className="flex @max-[470px]:hidden">
                        <input type="" className="bg-[#0000000d] p-[5px_10px] focus:outline-none rounded-[20px_0_0_20px] w-[200px] h-[35px]" />
                        <div className="bg-[#0000000d] w-[35px] flex items-center justify-center rounded-[0_20px_20px_0]">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}