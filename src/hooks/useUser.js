import { useEffect, useState } from "react";

import useFirebase from "../hooks/useFirebase";

function useUser(onFinishLoading = () => {}) {
	const { setUser, user, onAuthStateChanged, auth } = useFirebase();

    const [loadingUser, setLoadingUser] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			}
			onFinishLoading({user, hasUser: user !== undefined});
			setLoadingUser(false);
		});
		// eslint-disable-next-line
	}, []);

    return {
        loadingUser,
        user
    }
}

export default useUser;
