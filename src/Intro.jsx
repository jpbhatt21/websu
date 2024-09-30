import { useState } from "react";
import { useWindowDimensions } from "./Utility/Utils";
import { svg } from "./Utility/VectorGraphics";

function Intro() {
	const { height, width } = useWindowDimensions();
	let generateRandomPoints = () => {
		let points = [];
		for (let i = 0; i < 16; i++) {
			points.push([
				((Math.random() * width) / 3) * 2,
				((Math.random() * height) / 3) * 2,
			]);
		}
		return points;
	};
	const [points, setPoints] = useState(generateRandomPoints());
	let pts = points.map((point, index) => {
		const delay = 0.75 + (index / 15) * 0.4;
		return (
			<div key={index + "intro"}>
				<div
					className="triangle  opacity-0 absolute"
					style={{
						top: point[1] + height / 6,
						left: point[0] + width / 6,
						animation:
							"fadeIn 0.2s " +
							delay +
							"s,fadeIn  0.1s " +
							(delay + 0.2) +
							"s reverse",
					}}></div>
				{Math.random() > 0.5 ? (
					<div
						className="triangle2  opacity-0 absolute"
						style={{
							top: point[1] + height / 6,
							left: point[0] + width / 6,
							animation:
								"fadeIn 0.2s " +
								delay +
								"s,fadeIn  0.1s " +
								(delay + 0.2) +
								"s reverse",
						}}></div>
				) : (
					<></>
				)}
			</div>
		);
	});
	return (
		<>
			<div className="w-full pointer-events-none opacity-0 brighten h-full flex items-center text-3xl justify-center text-white montserrat   fixed bg-blank">
				{pts}
				<div
					className="absolute tracking-wider opacity-0"
					style={{ animation: "display 0.1s , widen 1.6s" }}>
					wel
					<span id="come" style={{ animation: "display 0.2s " }}>
						come
					</span>{" "}
					<span style={{ animation: "display 0.4s " }}>to</span>{" "}
					<span id="come" style={{ animation: "display 0.6s " }}>
						websu!
					</span>
				</div>
				<div
					className="flex w- full opacity-0 justify-evenly"
					style={{
						animation:
							"oxts 0.5s 1.6s,oxts1 0.2s 1.6s , oxts2 0.1s 1.8s, oxts3 0.5s 1.9s",
					}}>
					<div className="h-20 aspect-square">{svg.triangleIcon}</div>
					<div className="h-20 aspect-square">{svg.circleIcon}</div>
					<div className="h-20 aspect-square">{svg.crossIcon2}</div>
					<div className="h-20 aspect-square">{svg.squareIcon}</div>
				</div>
				<div className="w-1/3 opacity-0 logo-intro aspect-square fixed">
					<svg
						viewBox="0 0 64 64"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g
							id="SVGRepo_tracerCarrier"
							strokeLinecap="round"
							strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							{/* Circle outline */}
							<circle
								cx="32"
								cy="32"
								r="25.5"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								className="path"
							/>
							{/* 'w' shape */}
							<path
								d="M11.43,29v3.92a2.37,2.37,0,0,0,2.38,2.38h0a2.37,2.37,0,0,0,2.37-2.38V29"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							<path
								d="M16.25,29v3.92a2.37,2.37,0,0,0,2.38,2.38h0a2.37,2.37,0,0,0,2.37-2.38V29"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							{/* 'e' shape */}
							<path
								d="M28,35.3h-1.92a3.3,3.3,0,0,1-3.3-3.3v0a3.3,3.3,0,0,1,3.3-3.3H27"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							<path
								d="M25,32.25h1.92a1.75,1.75,0,0,0,1.75-1.75v0a1.75,1.75,0,0,0-1.75-1.75H27"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							{/* 'b' */}
							<rect
								x="30.5"
								y="28.97"
								width="4.76"
								height="6.30"
								rx="2.38"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							<line
								x1="30.5"
								y1="25.39"
								x2="30.5"
								y2="35.27"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							{/* 's' shape */}
							<path
								d="M37.25,34.74a2.67,2.67,0,0,0,1.96,0.53h0.53a1.58,1.58,0,0,0,1.58-1.58h0a1.58,1.58,0,0,0-1.58-1.58h-1.05a1.58,1.58,0,0,1-1.58-1.58h0a1.58,1.58,0,0,1,1.58-1.58h0.53a2.67,2.67,0,0,1,1.96,0.53"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							{/* 'u' shape */}
							<path
								d="M43.18,29v3.92a2.37,2.37,0,0,0,2.38,2.38h0a2.37,2.37,0,0,0,2.37-2.38V29"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							<line
								x1="47.95"
								y1="32.89"
								x2="47.95"
								y2="35.27"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
							{/* Exclamation mark '!' */}
							<circle
								cx="51"
								cy="35"
								r="0.75"
								fill="currentColor"
								transform="translate(0.875, 0)"
								className="fade-in2"
							/>
							<line
								x1="51"
								y1="25.39"
								x2="51"
								y2="32.5"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								transform="translate(0.875, 0)"
								className="path"
							/>
						</g>
					</svg>
				</div>
			</div>
		</>
	);
}

export default Intro;
