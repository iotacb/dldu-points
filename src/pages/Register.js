import React from "react";

import useFirebase from "../hooks/useFirebase";
import { useUserChange } from "../hooks/useUser";

import { useNavigate } from "react-router-dom";

import Backdrop from "../components/Backdrop";
import Button from "../components/Button";

function Register() {
	const { signInWithRedirect, collection, where, query, auth, provider, firestore, addDoc, getDocs } = useFirebase();

	const nav = useNavigate();

	const { loadingUser } = useUserChange(({ user }) => {
		if (user) {
			checkAndRegisterUser(user);
		}
	});

	const checkAndRegisterUser = async (user) => {
		if (user && user.documentId) {
			nav(`/dashboard`);
		} else {
			const createdDoc = await addDoc(collection(firestore, "users"), {
				userId: user.userId,
				apiKey: process.env.REACT_APP_API_KEY,
			});
			if (createdDoc) {
				nav(`/dashboard`);
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
