import React from "react";

import useFirebase from "../hooks/useFirebase";
import useUser from "../hooks/useUser";

import { useNavigate } from "react-router-dom";

import Backdrop from "../components/Backdrop";
import Button from "../components/Button";

function Register() {
	const {
		signInWithRedirect,
		collection,
		where,
		query,
		auth,
		provider,
		firestore,
		addDoc,
		getDocs,
	} = useFirebase();

	const nav = useNavigate();

	const { loadingUser } = useUser(({ user }) => {
		if (user) {
			registerUser(user);
		} else {
		}
	});

	const registerUser = async (user) => {
		if (user) {
			const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
			const docSnap = await getDocs(q);

			if (docSnap.docs.length === 0) {
				const dr = await addDoc(collection(firestore, "users"), {
					email: user.email,
					uid: user.uid,
					apiKey: process.env.REACT_APP_API_KEY
				});
				if (dr) {
					nav(`/dashboard/${dr.id}`);
				}
			} else {
				nav(`/dashboard/${docSnap.docs[0].id}`);
			}
		}
	};

	return (
		<div className="flex justify-center items-center h-screen w-screen">
			<Button
				onClick={() => {
					signInWithRedirect(auth, provider);
				}}
			>
				SIGN IN
			</Button>
			<Backdrop isLoader visible={loadingUser} />
		</div>
	);
}

export default Register;
