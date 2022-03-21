import React from "react";

function NumberPicker({ value, name, id, label, className, onChange }) {
	return (
		<div>
            <p htmlFor={id}>{label}</p>
			<input value={value} id={id} onChange={onChange} name={name} className={`w-full py-2 px-1 bg-gray-500 outline-none ${className}`} type="number"/>
		</div>
	);
}

export default NumberPicker;
