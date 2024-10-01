import { useEffect, useMemo, useState } from "react";
import {
	backgroundImage,
	decodeBeatMap,
	music,
	pause,
	play,
	useWindowDimensions,
} from "../Utility/Utils";
import { Container, Stage } from "@pixi/react";
import { ColorMatrixFilter, Geometry } from "pixi.js";
import HitObject from "../Components/HitObject";
import Slider from "../Components/SliderHitObject";
import { settings } from "../SettingsValues";
// import { setClear } from "./Components/MessageBox";

let delay = 0;
let eventListenerAttached=false
let colFil = new ColorMatrixFilter();
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export function bezier(t) {
	return t * t * (3.0 - 2.0 * t);
}
function PlayArea({ props,extraProps }) {
	const [approachRate, setApproachRate] = useState(0);
	const [hpDrain, setHpDrain] = useState(0);
	const [circleSize, setCircleSize] = useState(0);
	const [hitObjects, setHitObjects] = useState([]);
	const [hitObjectNumbers, setHitObjectNumbers] = useState([]);
	const [colors, setColors] = useState([]);
	const [completionColors, setCompletionColors] = useState(
		"163, 190, 140|".repeat(4).split("|").slice(0, 4)
	);
	const { height, width } = useWindowDimensions();
	let b = approachRate / 2;
	let c = approachRate / 4;
	let d = b + c;
	const [time, setTime] = useState(0.0001);
	let scalingFactor = height / 480;
	let horizontalOffset = (width - (4 * height) / 3) / 2;
	function keyaction(e) {
		try{
			if(!playArea){

			}
		}
		catch(e){
			document.removeEventListener("keydown", keyaction);
			eventListenerAttached=false
			return
		}
		try{
			if (e.repeat || (music.paused && !pauseMenu)) return;
		}
		catch(e){return}
		if (e.key == "Escape" || e.code == "Space") {
			
			if (!music.paused) {
				pause();
				extraProps.setShowPause(true)

			} else {
				pauseMenu.style.opacity = "0";
				pauseMenu.style.pointerEvents = "none";
				setTimeout(() => {
					extraProps.setShowPause(false)
					play();
				}, 1000);
			}
		}
	}
	function calculateHitObjectOpacity(delta) {
		let opacity = 0.9999;
		if (-d < delta && delta < -b) {
			opacity = bezier(1 + (delta + b) / c);
		} else if (0 < delta && delta < c) {
			opacity = bezier(1 - delta / c);
		}
		return opacity;
	}
	function calculateApproachCircleScale(delta) {
		let sc = 1;
		if (-d < delta && delta < 0) {
			sc = 1 + 2 * bezier(-delta / d);
		}
		return sc;
	}
	function calculateApproachCircleOpacity(delta) {
		let op = 0;
		if (-d < delta && delta < 0) {
			op = bezier(1 + delta / d);
		} else if (0 <= delta && delta < c) {
			op = bezier(1 - delta / c);
		}
		return op;
	}
	function getSliderPerct(delta, len) {
		let perct = 1;
		if (-d < delta && delta < -b) {
			perct = bezier(1 + (delta + b) / c);
		}
		return Math.round(perct * len);
	}
	function rgbToHex(rgb) {
		colFil = new ColorMatrixFilter();
		try {
			let t = rgb.split(",");
			let r = parseInt(t[0]).toString(16);
			let g = parseInt(t[1]).toString(16);
			let b = parseInt(t[2]).toString(16);
			if (r.length == 1) r = "0" + r;
			if (g.length == 1) g = "0" + g;
			if (b.length == 1) b = "0" + b;
			colFil.tint("#" + r + g + b);
			return "#" + r + g + b;
		} catch (e) {
			return "#dddddd";
		}
	}
	function getGeometry(arr, limit) {
		const geometry = new Geometry();
		geometry.addAttribute(
			"aVertexPosition",
			arr[0].slice(0, (limit + 1) * 12).map((x) => x * scalingFactor),
			2
		);
		geometry.addAttribute(
			"aUvs",
			"000110101101"
				.repeat(arr[1])
				.split("")
				.map((x) => parseInt(x)),
			2
		);
		return geometry;
	}
	function getCapGeometry(arr) {
		const geometry = new Geometry();
		geometry.addAttribute(
			"aVertexPosition",
			arr.map((x) => x * scalingFactor),
			2
		);
		geometry.addAttribute("aUvs", [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0], 2);
		return geometry;
	}
	const renderedHitObjects = useMemo(() => {
		return hitObjects
			.map((x) => {
				let deltaTime = time - x[1] - d;
				let hitObjectOpacity = calculateHitObjectOpacity(deltaTime);
				let approachCircleOpacity =
					calculateApproachCircleOpacity(deltaTime);
				let approachCircleScale =
					calculateApproachCircleScale(deltaTime);
				let tintColor = rgbToHex(colors[x[2]]);
				let hitObjectNumber = hitObjectNumbers[x[2]];
				let index = x[2];
				if (!(-d < deltaTime && deltaTime < c)) {
				} else if (x[0] == 0)
					return (
						<HitObject
							props={{
								x: x[3][0],
								y: x[3][1],
								circleSize,
								approachCircleScale,
								approachCircleOpacity,
								scalingFactor,
								tintColor,
								hitObjectNumber,
								hitObjectOpacity,
							}}
							key={"hitObject" + index}
						/>
					);
				else if (x[0] < 4) {
					let slp = getSliderPerct(deltaTime, x[3][3]);
					return (
						<Container key={"hitObject" + x[2]}>
							<Slider
								props={{
									shaderIndex: parseInt(
										hitObjectOpacity * 100
									),
									startCap: getCapGeometry(x[3][2][0]),
									endCap: getCapGeometry(x[3][2][1][slp]),
									sliderMesh: getGeometry(x[3], slp),
									filter: [colFil],
								}}
							/>
							<HitObject
								props={{
									x: (x[3][0][0] + x[3][0][2]) / 2,
									y: (x[3][0][1] + x[3][0][3]) / 2,
									circleSize,
									approachCircleScale,
									approachCircleOpacity,
									scalingFactor,
									tintColor,
									hitObjectNumber,
									hitObjectOpacity,
								}}
								key={"hitObject" + index}
							/>
						</Container>
					);
				}
			})
			.reverse();
	}, [hitObjects, time]);
	useEffect(() => {
		music.pause();
		music.currentTime = 0;
		let dbPrefix = "websu";
		if (props.online) dbPrefix = "tempWebsu";
		const openDB = indexedDB.open(dbPrefix + "Storage", 2);
		openDB.onsuccess = function (dbOpening) {
			const db = dbOpening.target.result;
			db
				.transaction("Files")
				.objectStore("Files")
				.get(props.setId).onsuccess = async function (fileOpening) {
				const file = fileOpening.target.result.files.find(
					(x) => x.id == props.id
				);
				await sleep(300);
				extraProps.setShowPause(false)
				let beatMap = await decodeBeatMap(
					file.file,
					props.setId,
					props.online
				); //Decode the beatmap
				await sleep(200);
				load.style.opacity = 0; //Hide loading screen
				await sleep(1000);
				if(!eventListenerAttached){
					document.addEventListener("keydown", keyaction);
					eventListenerAttached=true
				}
				extraProps.setShowLoading(false)
				setHitObjects(beatMap[2]); //hitObjects
				setApproachRate(beatMap[0] * 2); //approachRate
				setCircleSize(beatMap[1] * 2); //circleSize
				setHitObjectNumbers(beatMap[3]); //hitObjectNumbers
				setColors(beatMap[4]); //hitObjectColors
				setCompletionColors(beatMap[6]); //completionColors
				setTime(0); //currentTime
				var AudioContext =
					window.AudioContext || window.webkitAudioContext;
				var audioCtx = new AudioContext();
				music.pause();
				let delay = (settings.Audio["Audio Offset"].value - 50) / 50;
				let diff = 0;
				if (delay < 0) {
					if (beatMap[5]) {
						backgroundVideo.play();
					}

					music.play();
					await sleep(-delay * 1000);
				} else {
					diff = delay;
				}
				let playingTillApproachRate = new Promise((r) => {
					let prev = 0;
					function starter(time) {
						if (prev != 0) {
							//If time is greater than the approach rate, start the music
							if (
								time - prev >=
								(beatMap[0] * 1000 * 4) / 3 + delay * 1000
							) {
								r();
								return;
							}
							setTime(
								parseFloat(((time - prev) / 1000).toFixed(2))
							);
						} else {
							prev = time;
						}
						window.requestAnimationFrame(starter);
					}
					window.requestAnimationFrame(starter);
				});
				await playingTillApproachRate; //Wait for till time is greater than approach rate
				if (beatMap[5]) {
					backgroundVideo.play();
				}
				music.play();
				if (delay >= 0) {
					delay += (beatMap[0] * 4) / 3;
				}
				let songPlaying = new Promise((r) => {
					function player() {
						//If music is over, stop
						if (music.currentTime >= music.duration) {
							r();
							return;
						}
						//console.log(music.currentTime+delay);
						setTime(
							parseFloat(music.currentTime.toFixed(2)) + delay
						);
						window.requestAnimationFrame(player);
					}
					window.requestAnimationFrame(player);
				});
				await songPlaying; //Wait for music to end
				await sleep(200);
				if (music.currentTime >= music.duration) {
					props.setShowTopBar(true);
					props.setShowSongMenu(true);
					playArea.style.opacity = "0";
					if (beatMap[5]) {
						backgroundVideo.pause();
						backgroundVideoSource1.src = "";
						backgroundImage.style.display = "";
						await sleep(10);
						backgroundImage.style.opacity = 1;
					}
					setTimeout(async () => {
						props.setShowGame(false);
					}, 300);
					
				}
			};
		};
	}, []);
	let md4 = music.duration / 4;
	return (
		<>
			<div
				className="w-full h-full  flex flex-col justify-center items-center  fixed"
				style={{}}
				id="playArea">
				<Stage //PixiJS Stage
					height={height}
					width={width}
					options={{
						backgroundColor: 0x000000,
						backgroundAlpha: 0,
					}}>
					<Container
						x={horizontalOffset + 64 * scalingFactor}
						y={64 * scalingFactor}>
						{renderedHitObjects}
					</Container>
				</Stage>

				<div
					className="fixed z-40 rounded-full top-0 right-0 w-2 " //Left music completion bar 0-1/4th of the song
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
					className="fixed z-40 rounded-full bottom-0 right-0 h-2 bg-colors-green" //Bottom music completion bar 1/4th - 2/4th of the song
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
					className="fixed z-40 rounded-full  bottom-0 left-0 w-2 bg-colors-green" //Right music completion bar 2/4th - 3/4th of the song
					style={{
						height: (parseFloat(time - 2 * md4) / md4) * 100 + "%",
						background:
							"linear-gradient(0deg, rgb(" +
							completionColors[2] +
							") 0vh,  rgb(" +
							completionColors[3] +
							") 100vh",
					}}></div>
				<div
					className="fixed z-40 rounded-full top-0 left-0 h-2 bg-colors-green" //Top music completion bar 3/4th - 4/4th of the song
					style={{
						width: (parseFloat(time - md4 * 3) / md4) * 100 + "%",
						background:
							"linear-gradient(90deg, rgb(" +
							completionColors[3] +
							") 0vw,  rgb(" +
							completionColors[0] +
							") 100vw",
					}}></div>
			</div>
		</>
	);
}

export default PlayArea;
