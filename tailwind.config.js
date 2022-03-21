module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				garamond: "EB Garamond",
			},
			animation: {
				"loading-circle": "loading-circle 750ms linear infinite",
			},
			keyframes: {
				"loading-circle": {
					"0%": {
						"border-color": "rgb(209 213 219) rgb(75 85 99) rgb(75 85 99) rgb(107 114 128)",
					},
					"25%": {
						"border-color": "rgb(107 114 128) rgb(209 213 219) rgb(75 85 99) rgb(75 85 99)",
					},
					"50%": {
						"border-color": "rgb(75 85 99) rgb(107 114 128) rgb(209 213 219) rgb(75 85 99)",
					},
					"75%": {
						"border-color": "rgb(75 85 99) rgb(75 85 99) rgb(107 114 128) rgb(209 213 219)",
					},
					"100%": {
						"border-color": "rgb(209 213 219) rgb(75 85 99) rgb(75 85 99) rgb(107 114 128)",
					},
				},
			},
		},
	},
	plugins: [],
};
