import React from 'react';

function Button({onClick, children, className}) {

    return <div onClick={onClick} className={`px-4 py-2 flex justify-center items-center bg-orange-400 hover:bg-orange-500 cursor-pointer duration-300 ${className}`}>
        {children}
    </div>;
}

export default Button