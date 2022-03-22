import { useEffect, useState, useContext } from "react";

import { UserContext } from "../context/UserContext";
import useFirebase from "../hooks/useFirebase";

function useUserChange(onFinishLoading = () => {}) {
	const { onAuthStateChanged, auth, query, collection, firestore, where, getDocs, doc, getDoc } = useFirebase();
	const { user, setUser } = useUser();

	const [loadingUser, setLoadingUser] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, async (fUser) => {
			let userObj;
			if (fUser) {
				const mainUserInfoQuery = query(collection(firestore, "users"), where("userId", "==", fUser.uid));
				const userInfoSnap = await getDocs(mainUserInfoQuery);

				const docId = userInfoSnap?.docs[0]?.id;
				if (docId) {
					const userConfigDocRef = doc(firestore, "users", userInfoSnap?.docs[0]?.id);
					const userConfigSnap = await getDoc(userConfigDocRef);

					userObj = {
						userId: fUser.uid,
						documentId: userInfoSnap?.docs[0]?.id,
						apiKey: userConfigSnap?.data()?.apiKey,
						sheetsId: userConfigSnap?.data()?.sheetsId,
						config: {
							...userConfigSnap?.data()?.config,
						},
					};

					setUser(userObj);
				} else {
					userObj = {
						userId: fUser.uid,
						documentId: userInfoSnap?.docs[0]?.id,
					};
					setUser(userObj);
				}
			}
			onFinishLoading({ user: userObj });
			setLoadingUser(false);
		});
		// eslint-disable-next-line
	}, []);

	return {
		loadingUser,
		user,
	};
}

const useUser = () => useContext(UserContext);

export { useUserChange, useUser };
