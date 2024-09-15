/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				dark: {
					100: "#4C566A",
					200: "#434C5E",
					300: "#3B4252",
					400: "#2E3440",
				},
				light: {
					100: "#ECEFF4",
					200: "#E5E9F0",
					300: "#D8DEE9",
				},
				blue: {
					100: "#5E81AC",
					200: "#81A1C1",
					300: "#88C0D0",
					400: "#8FBCBB",
				},
				colors: {
					red: "#BF616A",
					orange: "#D08770",
					yellow: "#EBCB8B",
					green: "#A3BE8C",
					purple: "#B48EAD",
				},
        blank: "#1b1b1b",
				post: "#252525",
				bcol: "#939393",
				bhov: "#a3a3a3",
				bact: "#b3b3b3",
			},
		},
	},
	plugins: [],
};
