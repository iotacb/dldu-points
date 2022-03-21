import React, { createContext, useState } from "react";
import { initializeApp } from "@firebase/app";
import { getAuth, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithRedirect, getRedirectResult } from "@firebase/auth";
import { getFirestore, collection, onSnapshot, getDoc, setDoc, doc, query, where, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCdMvYwIsL6tKnxfxhxdsc3q4PcXAettQA",
	authDomain: "dldu-points-d79c3.firebaseapp.com",
	projectId: "dldu-points-d79c3",
	storageBucket: "dldu-points-d79c3.appspot.com",
	messagingSenderId: "136131419622",
	appId: "1:136131419622:web:bd82affcf1141eec0d0a27",
	measurementId: "G-L92Y0GHYKB",
};

const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();

const template = {
	firestore: firestore,
	auth: auth,
	provider: provider,
    user: null,
	doc: doc,
	signInWithRedirect: signInWithRedirect,
	getRedirectResult: getRedirectResult,
	collection: collection,
	query: query,
	where: where,
	onSnapshot: onSnapshot,
	signOut: signOut,
	onAuthStateChanged: onAuthStateChanged,
	getDoc: getDoc,
	setDoc: setDoc,
	addDoc: addDoc,
	getDocs: getDocs,
	setUser: () => {},
};

const FirebaseContext = createContext(template);

const FirebaseProvider = ({ children }) => {
	const [firebaseState, setFirebaseState] = useState(template);

	const setUser = (user) => {
		setFirebaseState({
			...firebaseState,
			user,
		});
	};

	return (
		<FirebaseContext.Provider
			value={{
				...firebaseState,
				setUser,
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
};

export { FirebaseContext, FirebaseProvider };
