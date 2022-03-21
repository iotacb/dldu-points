import React, { Fragment, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { CopyToClipboard } from "react-copy-to-clipboard";

import useFirebase from "../hooks/useFirebase";
import useUser from "../hooks/useUser";

import Backdrop from "../components/Backdrop";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import NumberPicker from "../components/NumberPicker";

import { ChromePicker } from "react-color";

import darkSoulsImage from "../assets/images/darksouls.jpg";

function Dashboard() {
	const nav = useNavigate();
	const { setUser, user, query, collection, setDoc, where, getDocs, firestore, getDoc, doc, signOut, auth } =
		useFirebase();
	const { uid } = useParams();
	const [userData, setUserData] = useState({});

	const [showLoading, setShowLoading] = useState();

	const [userID, setUserID] = useState("");
	const [sheetsId, setSheetsId] = useState("");
	const [apiKey, setApiKey] = useState("");

	const [fontColor, setFontColor] = useState({
		r: 255,
		g: 255,
		b: 255,
	});
	const [backgroundColor, setBackgroundColor] = useState({
		r: 0,
		g: 0,
		b: 0,
		a: 0,
	});
	const [position, setPosition] = useState("left");
	const [spacing, setSpacing] = useState(0);
	const [maxLevel, setMaxLevel] = useState(2);

	const { loadingUser } = useUser(({ user }) => {
		if (user) {
			setUser(user);
		} else {
			nav("/register");
		}
	});

	const getID = async (user) => {
		const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
		const docSnap = await getDocs(q);

		if (docSnap.docs.length > 0) {
			return docSnap.docs[0].id;
		}
		return "";
	};

	useEffect(() => {
		if (user) {
			if (uid === undefined) {
				getID(user).then((id) => {
					setUserID(id);
				});
			} else {
				setUserID(uid);
			}
		}
		// eslint-disable-next-line
	}, [user]);

	useEffect(() => {
		if (userID) {
			const data = getData(userID);
			data.then((result) => {
				setUserData(result);
				setSheetsId(result.sheetsId);
				setApiKey(result.apiKey);
			});
		}
		// eslint-disable-next-line
	}, [userID]);

	const getData = async (uid) => {
		const docRef = doc(firestore, "users", uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return docSnap.data();
		}
		return {};
	};

	const updateData = async (uid, data) => {
		setShowLoading(true);

		if (sheetsId.length !== 39) {
			setShowLoading(false)
		}

		// ignore warning
		// eslint-disable-next-line
		const dr = await setDoc(doc(firestore, "users", uid), {
			...data,
			sheetsId,
			apiKey,
			config: {
				...data.config,
				color: `rgb(${fontColor.r} ${fontColor.g} ${fontColor.b})`,
				backgroundColor: `rgba(${backgroundColor.r} ${backgroundColor.g} ${backgroundColor.b} / ${backgroundColor.a})`,
				textAlign: position,
				spacing: spacing,
				maxLevel: maxLevel
			},
		});
		setShowLoading(false);
	};

	const logout = () => {
		signOut(auth);
	};

	const pages = [
		{
			title: "Welcome",
			content: (
				<div className="p-4 flex flex-col w-full h-full justify-center items-center">
					<p className="text-4xl">Willkommen im DLDU-Points Dashboard</p>
					<p>Hier kannst du Einstellungen ändern und nachsehen.</p>
				</div>
			),
		},
		{
			title: "Account",
			content: (
				<div className="p-4 flex flex-col gap-4 w-full h-full">
					<div className="flex flex-col px-6 py-4 bg-gray-600 rounded-md gap-4 w-1/2 shadow-sm">
						<p>Google Sheets Informationen:</p>
						<TextInput
							className="w-full"
							value={sheetsId}
							onChange={(e) => setSheetsId(e.target.value)}
							label="Google Sheets ID"
						/>
						<div className="flex">
							<TextInput
								className="w-full"
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
								label="API Key (Optional)"
								password
							/>
							<CopyToClipboard text={`${apiKey}`}>
								<Button className="whitespace-nowrap">Key kopieren</Button>
							</CopyToClipboard>
						</div>
						<div className="flex gap-2">
							<Button onClick={() => updateData(userID, userData)}>Einstellungen Speichern</Button>
							<CopyToClipboard text={`http://localhost:3000/display/${uid}`}>
								<Button>Browsersource Link kopieren</Button>
							</CopyToClipboard>
						</div>
					</div>
					<div className="flex flex-col gap-4 w-1/2">
						<div className="flex gap-2">
							<Button onClick={() => logout()}>Ausloggen</Button>
						</div>
					</div>
				</div>
			),
		},
		{
			title: "Einstellungen",
			content: (
				<div className="p-4 flex flex-col gap-4 w-full h-full">
					<div className="flex flex-col px-6 py-4 bg-gray-600 rounded-md gap-4 w-1/2 shadow-sm">
						<p>Designs Einstellungen:</p>
						<div className="flex flex-wrap gap-4">
							<div>
								<p>Schriftfarbe:</p>
								<ChromePicker color={fontColor} onChange={(v) => setFontColor(v.rgb)} />
							</div>
							<div>
								<p>Hintergrund Farbe:</p>
								<ChromePicker color={backgroundColor} onChange={(v) => setBackgroundColor(v.rgb)} />
							</div>
							<NumberPicker value={spacing} onChange={(e) => setSpacing(e.target.value)} label="Zeilen Abstand:" />
							<NumberPicker value={maxLevel} onChange={(e) => setMaxLevel(e.target.value)} label="Maximale Level:" />
							<div>
								<label htmlFor="position">Position</label>
								<select
									onChange={(e) => setPosition(e.target.value)}
									value={position}
									id="position"
									name="position"
									className="bg-gray-500 px-4 py-2 outline-none w-full"
								>
									<option value="left">Links</option>
									<option value="right">Rechts</option>
								</select>
							</div>
						</div>
						<div className="flex gap-2">
							<Button onClick={() => updateData(userID, userData)}>Einstellungen Speichern</Button>
						</div>
					</div>
					<div className="flex flex-col gap-4 w-1/2"></div>
				</div>
			),
		},
		{
			title: "Preview",
			content: (
				<div className="relative flex flex-col w-full h-full justify-center items-center">
					<img alt="dark souls game preview" className="w-full h-full absolute object-cover" src={darkSoulsImage} />
					<iframe
						title="Preview"
						className="w-full h-full absolute"
						src="http://localhost:3000/display/zCsLJUJ59gdCGUQKvezU"
					></iframe>
				</div>
			),
		},
	];
	const [selectedPage, setSelectedPage] = useState(pages[0]);
	return (
		<div className="h-screen w-screen p-8">
			<div className="bg-gray-800 w-full h-full rounded-xl flex overflow-hidden">
				<div className="bg-gray-600 w-[256px] h-full py-4 flex flex-col items-center justify-between">
					<div className="w-full">
						{pages &&
							pages.map((page, i) => (
								<p
									key={i}
									onClick={() => (page.onClick === undefined ? setSelectedPage(page) : page.onClick())}
									className={`${
										selectedPage.title === page.title
											? "bg-gray-500 hover:bg-gray-400"
											: "bg-gray-600 hover:bg-gray-500"
									} w-full text-center py-4 text-xl font-medium cursor-pointer select-none transition-colors`}
								>
									{page.title}
								</p>
							))}
					</div>
					<p className="opacity-20">DLDU-Points v1.0</p>
				</div>
				{pages && pages.map((page, index) => <Fragment key={index}>{selectedPage.title === page.title ? <>{page.content}</> : <></>}</Fragment>)}
			</div>
			<Backdrop isLoader visible={loadingUser || showLoading} />
		</div>
	);
}

export default Dashboard;
