import React from "react";

import LoadingCircle from "./LoadingCircle";

function Backdrop({ visible, isLoader, children }) {
	return <div className={`${visible ? "opacity-100" : "opacity-0 pointer-events-none"} bg-black/40 backdrop-blur-md transition-opacity duration-300 w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-100`}>
		{isLoader ? <LoadingCircle/> : <>{children}</>}
	</div>
}

export default Backdrop;
export {};
