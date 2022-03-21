import React, { useState, useEffect } from "react";

function TextInput({ id, name, label, placeholder, value = "", onClick, onChange, className = "", password}) {
	const [focus, setFocus] = useState();
	const [hoverLabel, setHoverLabel] = useState();

    useEffect(() => {
        setHoverLabel(value.length > 0);
    }, [value])

	return (
		<div className={`relative ${className}`} onClick={onClick}>
			<label
				className={`absolute pointer-events-none left-2 ${
					focus || hoverLabel ? "left-[1px] top-0 scale-90 text-gray-500" : "top-1/2 -translate-y-1/2 text-white"
				} duration-300`}
				htmlFor={id}
			>
				{label}
			</label>
			<input
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				className={`bg-gray-700 px-2 pt-4 pb-1 outline-none duration-300 border-b-[1px] ${focus || hoverLabel ? "border-orange-500" : "border-orange-transparent"} ${className}`}
				type={`${password ? "password" : "text"}`}
				value={value}
				name={name}
				id={id}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</div>
	);
}

export default TextInput;
