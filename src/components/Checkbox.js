import React from "react";

function Checkbox({ label, onChange = () => {}, value = false }) {
	return (
		<div
			onClick={() => onChange(!value)}
			className="flex flex-col gap-2 cursor-pointer"
		>
			<label className="cursor-pointer">{label}</label>
			<div
				className={`w-16 h-8 bg-gray-500 rounded-xl relative after:absolute after:w-1/2 after:h-6 after:top-1/2 after:-translate-y-1/2 after:rounded-lg after:duration-200 ${
					value
						? "after:bg-orange-400 after:translate-x-[80%]"
						: "after:bg-gray-400 after:translate-x-[20%]"
				}`}
			></div>
		</div>
	);
}

export default Checkbox;
