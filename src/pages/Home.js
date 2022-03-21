import React from "react";

import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function Home() {
	const nav = useNavigate();

	return (
		<div className="flex flex-col justify-center items-center h-screen w-screen">
			<h1 className="text-8xl font-bold font-garamond">DLDU-Points</h1>
			<Button onClick={() => nav("/register")}>Jetzt Anmelden</Button>
		</div>
	);
}

export default Home;
