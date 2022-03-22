import React, { createContext, useState } from "react";

const template = {
    user: {},
	setUser: () => {},
};

const UserContext = createContext(template);

const UserProvider = ({ children }) => {
	const [userState, setUserState] = useState(template);

	const setUser = (user) => {
		setUserState({
			...userState,
			user,
		});
	};

	return (
		<UserContext.Provider
			value={{
				...userState,
				setUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
