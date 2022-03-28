import React, { useState, useEffect } from "react";
import axios from "axios";

import { motion, AnimatePresence } from "framer-motion";

import useFirebase from "../hooks/useFirebase";
import { useParams } from "react-router-dom";

function Display() {
	const { firestore, getDoc, doc } = useFirebase();
	const { uid } = useParams();

	const [sheetsData, setSheetsData] = useState({});
	const [pages, setPages] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [config, setConfig] = useState({});
	const [style, setStyle] = useState({});
	const [sheetsId, setSheetsId] = useState();
	const [apiKey, setApiKey] = useState();
	const [sumPoints, setSumPoints] = useState(0);
	const [sumCurrentPoints, setSumCurrentPoints] = useState(0);

	const [hasError, setHasError] = useState();

	const defaultStyle = {
		display: "inline-block",
		position: "absolute",
		color: "#FFF",
		textAlign: "right",
		backgroundColor: "transparent",
		spacing: 0,
		padding: 5,
	};

	const getData = async (uid) => {
		const docRef = doc(firestore, "users", uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return docSnap.data();
		}
		return {};
	};

	const fetchData = (sheetsId, apiKey) => {
		return new Promise(async (resolve, reject) => {
			const axiosConfig = {
				method: "get",
				url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/Sheet1?key=${apiKey}`,
			};
			axios(axiosConfig)
				.then((res) => {
					resolve(res.data);
					setSheetsData(res.data.values);
				})
				.catch((err) => {
					reject();
					console.log(err.stack);
					setHasError(err.stack);
				});
		});
	};

	useEffect(() => {
		const data = getData(uid);
		data.then((result) => {
			setSheetsId(result.sheetsId);
			setApiKey(result.apiKey);
			setConfig(result.config);
			setStyle(configToCSS(defaultStyle, result.config));
			fetchData(result.sheetsId, result.apiKey);
		});

		document.body.style.background = "transparent";
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		let interval;
		if (sheetsId && apiKey) {
			interval = setInterval(() => {
				fetchData(sheetsId, apiKey);
				const data = getData(uid);
				data.then((result) => {
					setConfig(result.config);
					setStyle(configToCSS(defaultStyle, result.config));
				});
			}, 10000);
		}

		return () => clearInterval(interval);
		// eslint-disable-next-line
	}, [sheetsId, apiKey]);

	useEffect(() => {
		if (sheetsData && sheetsData.length > 0) {
			let itemGroups = [];
			let pages = [];
			let data = {};
			for (let i = 2; i < sheetsData.length; i++) {
				const rows = sheetsData[i];
				if (true) {
					if (i === sheetsData.length - 1) {
						data[Object.keys(data).length] = rowToObj(rows);
						itemGroups.push(data);
						data = {};
					} else {
						if (rows.length > 0) {
							data[Object.keys(data).length] = rowToObj(rows);
						} else {
							itemGroups.push(data);
							data = {};
						}
					}
				}
			}
			let pageGroups = [];
			for (let i = 0; i < itemGroups.length; i++) {
				const group = itemGroups[i];
				const modulo = config && config.maxLevel ? config.maxLevel : 2;
				if (i > 0 && i % modulo === 0) {
					pages.push(pageGroups);
					pageGroups = [];
					pageGroups.push(group);
				} else {
					pageGroups.push(group);
				}

				if (i === itemGroups.length - 1) {
					pages.push(pageGroups);
				}
			}
			setPages(pages);
			let maxPoints = 0;
			let currentMaxPoints = 0;
			itemGroups.forEach((group) => {
				for (let i = 0; i < Object.keys(group).length; i++) {
					const row = group[i];
					const points = Number.parseInt(row?.points);
					if (row.points) {
						maxPoints += points;
						if (row.beaten.toLowerCase() === "true") {
							currentMaxPoints += points;
						}
					}
				}
			});
			setSumPoints(maxPoints);
			setSumCurrentPoints(currentMaxPoints);
		}
		// eslint-disable-next-line
	}, [sheetsData]);

	useEffect(() => {
		let interval;
		if (pages) {
			interval = setInterval(() => {
				setCurrentPage((current) =>
					current < pages.length - 1 ? current + 1 : 0
				);
			}, 5000);
		}

		return () => clearInterval(interval);
	}, [pages]);

	const configToCSS = (defaultStyle, config) => {
		let css = {};
		if (config) {
			const color = config?.color;
			const textAlign = config?.textAlign;
			const backgroundColor = config?.backgroundColor;
			const spacing = config?.spacing;
			css = {
				...defaultStyle,
				color,
				textAlign,
				backgroundColor,
				spacing,
			};
			css[textAlign === "left" ? "left" : "right"] = 0;
		}
		return css;
	};

	return (
		<div style={style}>
			{hasError ? (
				<div className="max-w-xl flex flex-col gap-6 p-4">
					<div className="text-red-300">
						<h1 className="text-red-500 font-bold text-3xl">
							Es ist etwas schiefgelaufen!
						</h1>
						<p>
							Sollte das problem weiterhin auftreten, melde das Problem bitte.
						</p>
						<p>Infos dazu findest du auf https://dldupoints.de/issue</p>
					</div>
					<p>{hasError}</p>
				</div>
			) : (
				<>
					{config.usePoints && (
						<p className="text-5xl font-garamond drop-shadow-ds">{`Gesamtpunktzahl: ${sumCurrentPoints}/${sumPoints}`}</p>
					)}
					<AnimatePresence exitBeforeEnter>
						<motion.div
							key={pages && pages[currentPage] ? currentPage : "empty"}
							// animate={{ opacity: 1, y: 0 }}
							// initial={{ opacity: 0, y: -20 }}
							// exit={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1 }}
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className="p-4 w-full h-full"
						>
							{pages[currentPage] &&
								pages[currentPage].map((group, i) => (
									<>
										<DisplayGroup config={config} key={i} group={group} />
										<div
											className={`w-full h-2 bg-line bg-contain bg-no-repeat ${
												config.showSpacer && i !== pages[currentPage].length - 1
													? "opacity-100 my-4"
													: "opacity-0 my-0"
											}`}
										></div>
									</>
								))}
						</motion.div>
					</AnimatePresence>
					<p className="text-sm opacity-20 font-bold text-center font-garamond">
						DLDU-Points https://dldupoints.de
					</p>
				</>
			)}
		</div>
	);
}

const DisplayGroup = ({ group, config }) => {
	const rows = [];
	let maxPoints = 0;
	let completedPoints = 0;
	for (let i = 0; i < Object.keys(group).length; i++) {
		const row = group[i];
		const points = Number.parseInt(row?.points);
		if (row.points && config.usePoints) {
			maxPoints += points;
			if (row.beaten && row.beaten.toLowerCase() === "true") {
				completedPoints += points;
			}
		}
	}
	for (let i = 0; i < Object.keys(group).length; i++) {
		const row = group[i];
		rows.push({
			title: row.type === "level",
			text: `${
				row.type === "level"
					? `${row.name} ${
							config.usePoints ? `- ${completedPoints}/${maxPoints}` : ""
					  }`
					: `${row.name} ${config.usePoints ? `| ${row.points}` : ""}`
			}`,
			beaten: row.beaten && row.beaten.toLowerCase() === "true",
		});
	}
	return (
		<div
			style={{
				marginTop: config.spacing,
			}}
		>
			{rows &&
				rows.map((row, i) => <DisplayRow config={config} key={i} row={row} />)}
		</div>
	);
};

const DisplayRow = ({ row, config }) => {
	return (
		<p
			className={`${
				row.title
					? "text-3xl font-bold opacity-100"
					: `text-2xl ${
							config.colorBeaten
								? row.beaten
									? "opacity-100"
									: "opacity-50"
								: "opacity-100"
					  }`
			} font-garamond duration-300 drop-shadow-ds`}
		>
			{row.text}
		</p>
	);
};
const rowToObj = (row) => {
	const type = row[0];
	const name = row[1];
	const points = row[2];
	const beaten = row[3];
	return {
		type,
		name,
		points,
		beaten,
	};
};

export default Display;
