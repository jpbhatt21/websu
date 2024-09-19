import { useEffect, useState } from "react";
import { backgroundImage, decodeBeatMap, music } from "./Utils";
let loaded=[]
function PlayArea({ setId = 0, id = 0, setStart, attempts, online }) {
	const [approachRate, setApproachRate] = useState(0);
	const [hpDrain, setHpDrain] = useState(0);
	
	const [circleSize, setCircleSize] = useState(0);
	const [timedHitObjects, setTimedHitObjects] = useState([]);
	const [timedSliders, setTimedSliders] = useState([]);
	const [len, setLen] = useState(0);
	const [timingPoints, setTimingPoints] = useState([]);
	const [colors, setColors] = useState([]);
	const [completionColors, setCompletionColors] = useState(
		"163, 190, 140|".repeat(4).split("|").slice(0, 4)
	);
	const [time, setTime] = useState(0.01);
	let delay = 0;
	useEffect(() => {
		music.pause();
		music.currentTime = 0;
		console.log(online, setId, id);
		let pre = "websu";
		if (online) pre = "tempWebsu";
		const request = indexedDB.open(pre + "Storage", 2);
		request.onsuccess = function (event) {
			const db = event.target.result;

			db.transaction("Files").objectStore("Files").get(setId).onsuccess =
				async function (event) {
					const file = event.target.result.files.find(
						(x) => x.id == id
					);
					let x = await decodeBeatMap(file.file, setId, online);

					await new Promise((resolve) => {
						setTimeout(() => {
							resolve();
						}, 100);
					});
					load.style.opacity = 0;
					await new Promise((resolve) => {
						setTimeout(() => {
							resolve();
						}, 1000);
					});
					console.log(x[2].filter((x) => x[0] == 0));
					let timedSlidersCollection = [];
					loaded=("0".repeat(x[2].length).split("").map(x=>parseInt(x)))
					let timedHitObjectsCollection = [];
					for (let i = 0; i < music.duration; i += 10) {
						timedHitObjectsCollection.push(
							x[2].filter((x2) => x2[1] > i - 5 && x2[1] < i + 15)
						);
						timedSlidersCollection.push(
							timedHitObjectsCollection[
								timedHitObjectsCollection.length - 1
							].filter((x) => x[0] < 4 && x[0] > 0)
						);
					}
					setLen(x[2].length);
					setApproachRate(x[0]);
					setCircleSize(x[1]);
					setTimingPoints(x[3]);
					setColors(x[4]);
					setCompletionColors(x[6]);
					// document.querySelector(':root').style.setProperty("--circle-size",parseInt(circleSize/2 +10))
					// document.querySelector(':root').style.setProperty("--c2ircle-size",parseInt(circleSize*2))
					//console.log(x[6]);
					setTime(0);
					var AudioContext =
						window.AudioContext || window.webkitAudioContext;
					var audioCtx = new AudioContext();
					// var AudioContext =
					// 	window.AudioContext || window.webkitAudioContext;
					// var audioCtx = new AudioContext();

					// var oscillatorNode = audioCtx.createOscillator();
					// var oscillatorGainNode = audioCtx.createGain();
					// var finish = audioCtx.destination;

					// var distortionGainNode = audioCtx.createGain();
					// var distortionNode = audioCtx.createWaveShaper();

					// function makeDistortionCurve(amount) {
					// 	var k = amount,
					// 		n_samples =
					// 			typeof sampleRate === "number"
					// 				? sampleRate
					// 				: 44100,
					// 		curve = new Float32Array(n_samples),
					// 		deg = Math.PI / 180,
					// 		i = 0,
					// 		x;
					// 	for (; i < n_samples; ++i) {
					// 		x = (i * 2) / n_samples - 1;
					// 		curve[i] =
					// 			((3 + k) * Math.atan(Math.sinh(x * 0.25) * 5)) /
					// 			(Math.PI + k * Math.abs(x));
					// 	}
					// 	return curve;
					// }

					// distortionNode.curve = makeDistortionCurve(400);

					// oscillatorNode.connect(oscillatorGainNode);
					// oscillatorGainNode.connect(distortionGainNode);
					// distortionGainNode.connect(distortionNode);
					// distortionNode.connect(finish);

					// oscillatorNode.start(0);
					//music.currentTime=music.duration-5
					music.play();
					if (x[5]) {
						backgroundVideo.play();
					}

					let pointerIndex = -1;
					let t = 0;
					while (music.currentTime < music.duration) {
						t = parseFloat(music.currentTime.toFixed(2));
						if (pointerIndex != parseInt(t / 10)) {
							pointerIndex = parseInt(t / 10);
							setTimedHitObjects(
								timedHitObjectsCollection[pointerIndex]
							);

							setTimedSliders(
								timedSlidersCollection[pointerIndex]
							);
						}
						setTime(t);
						await new Promise((resolve) => {
							setTimeout(() => {
								resolve();
							}, 10);
						});
					}
					await new Promise((resolve) => {
						setTimeout(() => {
							resolve();
						}, 1000);
					});

					if (music.currentTime >= music.duration) {
						if (x[5]) {
							backgroundVideo.pause();
							backgroundVideoSource1.src = "";
							backgroundImage.style.display = "";
							await new Promise((resolve) => {
								setTimeout(() => {
									resolve();
								}, 10);
							});
							backgroundImage.style.opacity = 1;
						}
						setStart(false);
					}
				};
		};
		setTimeout(() => {
			//load.style.opacity=0
		}, 1000);
	}, []);
	let sliders = timedSliders.map((x, i) => (
		<g
			key={"slider" + x[2]}
			className=" fixed"
			style={{
				zIndex: len - x[2] + 30,
				display: time - x[1] > 0 ? "" : "none",
				animation:
					"sliderFadeIn " +
					approachRate +
					"s linear 0s 1 forwards , sliderFadeOut " +
					approachRate / 4 +
					"s linear " +
					((approachRate * 3) / 4 + x[5] * x[6]) +
					"s 1 forwards  ",
			}}>
			<path
				onClick={(e) => {}}
				strokeLinecap="round"
				className="  pointer-events-auto"
				d={x[3]}
				strokeWidth={circleSize + 26}
				stroke={"rgba(" + colors[x[2]] + ",0.4)"}
				fill="transparent"
				style={{ zIndex: 30 }}
			/>
			<path
				onClick={(e) => {}}
				strokeLinecap="round"
				className="brightness-75 dura pointer-events-auto"
				d={x[3]}
				strokeWidth={circleSize + 22}
				stroke="#00000099"
				fill="transparent"
				style={{ zIndex: 30 }}
			/>
			<path
				onClick={(e) => {}}
				strokeLinecap="round"
				className="brightness-75 dura pointer-events-auto"
				d={x[3]}
				strokeWidth={1}
				strokeDasharray={"2 4"}
				stroke={"rgba(" + colors[x[2]] + ",0.1)"}
				fill="transparent"
				style={{ zIndex: 30 }}
			/>
		</g>
	));
	function getScale(t) {
		let diff = time - t;
		let sc = 1;
		if (diff < (approachRate / 4) * 3) {
			sc = 1 + 4 * (1 - diff / ((approachRate / 4) * 3));
		}
		return sc;
	}
	function getR(i){
		let ld=loaded
		console.log(loaded[i])
		if(ld[i]==0)
			{
			ld[i]=1
			loaded=ld
			return circleSize*2
		}
		else
		return (circleSize/2 +10)
	}
	let points = timedHitObjects.map((x, i) =>
		time - x[1] < 0 ? (
			<></>
		) : x[0] == 0 ? (
			time - x[1] > approachRate ? (
				<></>
			) : (
				<>
					<circle
						key={"hit" + x[2]}
						r={circleSize / 2}
						cx={x[3][0]}
						cy={x[3][1]}
						stroke={"rgb(" + colors[x[2]] + ")"}
						strokeWidth={4}
						fill="#1b1b1b88"
						className="absolute fadex opacity-0 aspect-square flex items-center justify-center text-bact rounded-full  bg-post bg-opacity-50 pointer-events-none"
						style={{
							zIndex: len - x[2] + 50,
							animation: "hit " + approachRate + "s" + " linear ",
						}}>
						<text className="scale-150">{timingPoints[x[2]]}</text>
					</circle>
					<circle
						className="absolute  h-full opacity-0 rounded-full"
						r={circleSize / 2 + 10}
						cx={x[3][0]}
						cy={x[3][1]}
						stroke={"#b3b3b3"}
						fill="transparent"
						strokeWidth={4}
						style={{
							zIndex: len - x[2] + 50,
							animation:
								"fade " + approachRate + "s" + " linear ",
						}}></circle>
					<circle
						key={"hit2" + x[2]}

						className="absolute redstrk  h-full  duration-1000 opacity-0 rounded-full"
						r={getR(x[2]) }
						cx={x[3][0]}
						cy={x[3][1]}
						stroke={"rgb(" + colors[x[2]] + ")"}
						fill="transparent"
						strokeWidth={4}
						style={{
							zIndex: len - x[2] + 50,
							animation:
								"fade " + approachRate + "s" + " linear ",
						}}>
							    
						</circle>
				</>
			)
		) : x[0] < 4 ?(
			time - x[1] > approachRate + x[6]*x[5] || true ? 
				<></>
			: 
			<>
				<circle
					key={"hit" + x[2]}
					className="absolute fadex duration-150 opacity-0 top-0 left-0 aspect-square flex items-center justify-center text-bact rounded-full  pointer-events-none"
					cx="0"
					cy="0"
					r={circleSize / 2}
					stroke={"rgb(" + colors[x[2]] + ")"}
					strokeWidth="4"
					fill="#1b1b1b"
					fillOpacity={0.5}
					style={{
						zIndex: len - x[2] + 50,
						animation: `
				  hit ${approachRate}s linear,
				  move ${x[6]}s linear ${(approachRate * 3) / 4}s ${x[5]} ${
							x[5] > 1 ? "alternate" : "forwards"
						},
				  sliderFadeIn ${approachRate}s linear 0s 1 forwards,
				  sliderFadeOut ${approachRate / 4}s linear ${
							(approachRate * 3) / 4 + x[6] * x[5]
						}s 1 forwards
				`,
						offsetRotate: "0deg",
						offsetPath: `path('${x[3]}')`,
					}}></circle>
				<circle
					className="absolute  h-full opacity-0 rounded-full"
					r={circleSize / 2 + 10}
					cx="0"
					cy="0"
					stroke={"#b3b3b3"}
					fill="transparent"
					strokeWidth={4}
					style={{
						zIndex: len - x[2] + 50,
						animation: "fade " + approachRate + "s" + " linear ",
						offsetRotate: "0deg",
						offsetPath: `path('${x[3]}')`,
					}}></circle>
				<circle
					className="absolute  h-full opacity-0 rounded-full"
					r={(circleSize / 2 + 10)}
					cx="0"
					cy="0"
					stroke={"rgb(" + colors[x[2]] + ")"}
					fill="transparent"
					strokeWidth={4}
					style={{
						zIndex: len - x[2] + 50,
						animation:
								"fade " + approachRate + "s" + " linear ",
						offsetRotate: "0deg",
						offsetPath: `path('${x[3]}')`,
					}}>
							 <animate attributeType="xml" attributeName="r" from={circleSize*2} to={circleSize/2 +10} dur={approachRate+"s"} repeatCount="indefinite" />  

					</circle>
			</>
		) : (
			<></>
		)
	);
	let md4 = music.duration / 4;
	return (
		<>
			<div
				className="w-full h-full  flex flex-col justify-center items-center  fixed"
				style={{}}
				id="playArea">
				<div
					className="fixed flex flex-col justify-center items-center  "
					style={{
						transform:
							"scale(" +
							window.innerHeight / (384 + circleSize * 3) +
							")",

						height: 384 + circleSize * 3 + "px",
						width: 512 + circleSize * 3 + "px",
					}}>
					<svg
						key={"scresen"}
						className="absolute w-full h-full    pointer-events-none"
						style={{}}
						fill="black"
						xmlns="http://www.w3.org/2000/svg"
						id="svghold">
						{sliders}
						{points}
					</svg>
				</div>
				<div
					className="fixed z-40 rounded-full top-0 left-0 h-2 bg-colors-green"
					style={{
						width: (parseFloat(time - md4 * 3) / md4) * 100 + "%",
						background:
							"linear-gradient(90deg, rgb(" +
							completionColors[3] +
							") 0vw,  rgb(" +
							completionColors[0] +
							") 100vw",
					}}></div>
				<div
					className="fixed z-40 rounded-full top-0 right-0 w-2 "
					style={{
						height: (parseFloat(time) / md4) * 100 + "%",
						background:
							"linear-gradient(180deg, rgb(" +
							completionColors[0] +
							") 0vh,  rgb(" +
							completionColors[1] +
							") 100vh",
					}}></div>
				<div
					className="fixed z-40 rounded-full bottom-0 right-0 h-2 bg-colors-green"
					style={{
						width: (parseFloat(time - md4) / md4) * 100 + "%",
						background:
							"linear-gradient(270deg, rgb(" +
							completionColors[1] +
							") 0vw,  rgb(" +
							completionColors[2] +
							") 100vw",
					}}></div>
				<div
					className="fixed z-40 rounded-full  bottom-0 left-0 w-2 bg-colors-green"
					style={{
						height: (parseFloat(time - 2 * md4) / md4) * 100 + "%",
						background:
							"linear-gradient(0deg, rgb(" +
							completionColors[2] +
							") 0vh,  rgb(" +
							completionColors[3] +
							") 100vh",
					}}></div>
			</div>
		</>
	);
}

export default PlayArea;
