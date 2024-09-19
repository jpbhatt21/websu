import { useEffect, useMemo, useState } from "react";
import { backgroundImage, decodeBeatMap, music } from "./Utils";
import { Container, Graphics, Sprite, Stage, Text } from "@pixi/react";

let delay = 0;
function PlayArea({ setId = 0, id = 0, setStart, attempts, online }) {
	const [approachRate, setApproachRate] = useState(0);
	const [hpDrain, setHpDrain] = useState(0);
	const [circleSize, setCircleSize] = useState(0);
	const [timedHitObjects, setTimedHitObjects] = useState([]);
	const [timedSliders, setTimedSliders] = useState([]);
	const [len, setLen] = useState(0);
	const [timingPoints, setTimingPoints] = useState([]);
	const [colors, setColors] = useState([]);
	const [height, setHeight] = useState(window.innerHeight);
	const [completionColors, setCompletionColors] = useState(
		"163, 190, 140|".repeat(4).split("|").slice(0, 4)
	);
	const [prev, setPrev] = useState(0);
	let past=0
	let b = approachRate / 2;
	let c = approachRate / 4;
	let d = b + c;
	const [time, setTime] = useState(0.0001);
	let scx = height / 480;
	let ofs = (window.innerWidth - (4 * height) / 3) / 2;
	function setScaleOp(diff) {
		let opacity = 1;
		if (-d < diff && diff < -b) {
			opacity = bezier(1 + (diff + b) / c);
		} else if (0 < diff && diff < c) {
			opacity = bezier(1 - diff / c);
		}
		return opacity;
	}
	function getSc(diff) {
		let sc = 1;
		if (-d < diff && diff < 0) {
			sc = 1 + 2 * bezier(-diff / d);
		}
		return sc;
	}
	function getOp2(diff) {
		let op = 0;
		if (-d < diff && diff < 0) {
			op = bezier(1 + diff / d);
		} else if (0 <= diff && diff < c) {
			op = bezier(1 - diff / (c ));
		}
		return op;
	}
	function rgbToHex(rgb) {
		try{
			let t = rgb.split(",");
		let r=parseInt(t[0]).toString(16)
		let g=parseInt(t[1]).toString(16)
		let b=parseInt(t[2]).toString(16)
		if(r.length==1)r="0"+r
		if(g.length==1)g="0"+g
		if(b.length==1)b="0"+b
		return (
			"#" +r + g + b
		);
		}
		catch(e){
			return "#dddddd"
		}
	}
	function bezier(t) {
		return t * t * (3.0 - 2.0 * t);
	}
	const ar= useMemo(() => {
		
		return timedHitObjects.map((x) => {
		let diff = time - x[1] - d;
		let opacity = setScaleOp(diff);
		let opacity2 = getOp2(diff);
		let scale = getSc(diff);
		if (!(-d < diff && diff < c)) return <></>;
		else if (x[0] == 0)
			return (
				<Container
					alpha={opacity}
					zIndex={len - x[2] + 50}
					x={x[3][0] * scx}
					y={x[3][1] * scx}>
					<Sprite
						image="/hitcircle.png"
						height={circleSize * scx}
						width={circleSize * scx}
						anchor={0.5}
						tint={rgbToHex(colors[x[2]])}
					/>
					{timingPoints[x[2]] < 10 ? (
						<Sprite
							image={"/" + timingPoints[x[2]] + ".png"}
							scale={{ x: 0.3 * scx, y: 0.3 * scx }}
							anchor={0.5}
						/>
					) : timingPoints[x[2]] < 100 ? (
						<>
							<Sprite
								image={
									"/" +
									parseInt(timingPoints[x[2]] / 10) +
									".png"
								}
								scale={{ x: 0.3 * scx, y: 0.3 * scx }}
								x={-20 * 0.3 * scx}
								anchor={0.5}
							/>
							<Sprite
								image={"/" + (timingPoints[x[2]] % 10) + ".png"}
								scale={{ x: 0.3 * scx, y: 0.3 * scx }}
								x={20 * 0.3 * scx}
								anchor={0.5}
							/>
						</>
					) : (
						<></>
					)}
					<Sprite
						image="/approachcircle.png"
						height={(circleSize + 8) * scx}
						width={(circleSize + 8) * scx}
						alpha={scale>1?opacity2:0}
						anchor={0.5}
					/>
					<Sprite
						image="/approachcircle.png"
						height={(circleSize + 8) * scx * scale}
						width={(circleSize + 8) * scx * scale}
						alpha={opacity2}
						anchor={0.5}
						tint={rgbToHex(colors[x[2]])}
					/>
				</Container>
			);
	}).reverse();}, [timedHitObjects, time]);
	useEffect(() => {
		const handleResize = () => {
			setHeight(window.innerHeight);
		};
		window.addEventListener("resize", handleResize);

		music.pause();
		music.currentTime = 0;
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
					let timedSlidersCollection = [];

					let timedHitObjectsCollection = [];
					setTimedHitObjects(x[2]);
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
					setApproachRate(x[0] * 2);
					setCircleSize(x[1] * 2);
					setTimingPoints(x[3]);
					setColors(x[4]);
					setCompletionColors(x[6]);
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

					
					let pointerIndex = -1;
					let t = 0;
					music.pause();
					let t1 = new Date().getTime();
					let t2 = 0;
					let pt=0
					while (t <= x[0]) {
						t2 = new Date().getTime();
						t += (t2 - t1) / 1000;
						t1 = t2;
						setPrev(pt)
						setTime(t);
						pt=t
						await new Promise((resolve) => {
							setTimeout(() => {
								resolve();
							}, 0);
						});
					}
					t = 0;
					if (x[5]) {
						backgroundVideo.play();
					}

					music.play();
					pt=0
					while (music.currentTime < music.duration) {
						t = parseFloat(music.currentTime.toFixed(2));
						// if (pointerIndex != parseInt(t / 10)) {
						// 	pointerIndex = parseInt(t / 10);
						// 	setTimedHitObjects(
						// 		timedHitObjectsCollection[pointerIndex]
						// 	);

						// 	setTimedSliders(
						// 		timedSlidersCollection[pointerIndex]
						// 	);
						// }
						
						setPrev(pt+x[0])
						setTime(t + x[0]);
						pt=t
						await new Promise((resolve) => {
							setTimeout(() => {
								resolve();
							}, 0);
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

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	let getPoints = (x) => {
		return x[3][0];
	};
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
	let points = timedHitObjects.map((x, i) =>
		x[0] == 0 ? (
			<div
				key={"hit" + x[2]}
				className=" absolute fadex opacity-0 -translate-x-1/2 -translate-y-1/2 aspect-square flex items-center justify-center text-bact  rounded-full outline outline-4 bg-post bg-opacity-50 pointer-events-none"
				style={{
					zIndex: len - x[2] + 50,
					top: x[3][1],
					left: x[3][0],
					height: 10 + "px",
					outlineColor: "rgb(" + colors[x[2]] + ")",
					display: time - x[1] > 0 ? "" : "none",
					animation: "hit " + approachRate + "s" + " linear ",
				}}>
				<div
					className="absolute  h-full scale-[140%] opacity-0 outline-[2px] outline-bact  outline aspect-square rounded-full"
					style={{
						height: circleSize + "px",
						animation: "fade " + approachRate + "s" + " linear ",
					}}></div>
				<div
					className="absolute  h-full  outline-[2px] opacity-0 outline-bact  outline aspect-square rounded-full"
					style={{
						height: circleSize + "px",
						outlineColor: "rgb(" + colors[x[2]] + ")",
						animation: "hit2 " + approachRate + "s" + " ease-out ",
					}}></div>
				<div className="scale-150">{timingPoints[x[2]]}</div>
			</div>
		) : x[0] < 4 ? (
			<div
				key={"hit" + x[2]}
				className=" absolute fadex duration-150 opacity-0 top-0 left-0  aspect-square flex items-center justify-center text-bact  rounded-full outline outline-4 bg-post bg-opacity-50 pointer-events-none"
				style={{
					zIndex: len - x[2] + 50,

					height: circleSize + "px",
					outlineColor: "rgb(" + colors[x[2]] + ")",
					display: time - x[1] > 0 ? "" : "none",
					animation: "hit " + approachRate + "s" + " linear ",
					animation:
						"move " +
						x[6] +
						"s linear " +
						(approachRate * 3) / 4 +
						"s " +
						x[5] +
						" " +
						(x[5] > 1 ? "alternate" : "forwards") +
						" , sliderFadeIn " +
						approachRate +
						"s linear 0s 1 forwards , sliderFadeOut " +
						approachRate / 4 +
						"s linear " +
						((approachRate * 3) / 4 + x[6] * x[5]) +
						"s 1 forwards  ",
					offsetRotate: "0deg",
					offsetPath: "path('" + x[3] + "')",
				}}>
				<div
					className="absolute  h-full scale-[140%] opacity-0 outline-[2px] outline-bact  outline aspect-square rounded-full"
					style={{
						height: circleSize + "px",
						animation: "fade " + approachRate + "s" + " linear ",
					}}></div>
				<div
					className="absolute  h-full  outline-[2px] opacity-0 outline-bact  outline aspect-square rounded-full"
					style={{
						height: circleSize + "px",
						outlineColor: "rgb(" + colors[x[2]] + ")",
						animation: "hit2 " + approachRate + "s" + " ease-out ",
					}}></div>
				<div className="scale-150">{timingPoints[x[2]]}</div>
			</div>
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
						transform: "scale(" + height / 480 + ")",

						height: 480 + "px",
						width: 640 + "px",
					}}>
					<svg
						key={"scresen"}
						className="absolute w-full h-full    pointer-events-none"
						style={{}}
						fill="black"
						xmlns="http://www.w3.org/2000/svg"
						id="svghold">
						{/* {sliders} */}
					</svg>
				</div>
				<Stage
					id="stg"
					height={height}
					width={window.innerWidth}
					options={{
						backgroundColor: "rgba(0,0,0)",
						backgroundAlpha: 0,
					}}>
					<Container x={ofs + 64 * scx} y={64 * scx}>
						<Graphics
							draw={(g) => {
								g.clear();
								g.beginFill(0x000000, 0);
								g.drawRect(
									0,
									0,
									(4 * 384 * scx) / 3,
									384 * scx
								);
								g.endFill();
							}}
						/>
						<Graphics
							draw={(g) => {
								g.clear();
								g.beginFill(0xff0000, 0);
								g.drawRect(
									0,
									0,
									(circleSize / 2) * scx,
									(circleSize / 2) * scx
								);
								g.endFill();
							}}
						/>

						{ar}
					</Container>
				</Stage>
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
