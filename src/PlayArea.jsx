import { useEffect, useState } from "react";
import { backgroundImage, decodeBeatMap, music } from "./Utils";
function PlayArea({ setId = 0, id = 0, setStart}) {
	const [approachRate, setApproachRate] = useState(0);
	const [hpDrain, setHpDrain] = useState(0);
	const [circleSize, setCircleSize] = useState(0);
	const [timedHitObjects, setTimedHitObjects] = useState([]);
	const [timedSliders, setTimedSliders] = useState([]);
	const [len,setLen]=useState(0)
	const [timingPoints, setTimingPoints] = useState([]);
	const [colors, setColors] = useState([]);
	const [time, setTime] = useState(0.01);
	let delay = 0;
	useEffect(() => {
		music.pause()
		music.currentTime = 0;
		const request = indexedDB.open("osuStorage", 2);
		request.onsuccess = function (event) {
			const db = event.target.result;
			db.transaction("Files").objectStore("Files").get(setId).onsuccess =
				async function (event) {
					const file = event.target.result.files.find(
						(x) => x.id == id
					);
					let x = await decodeBeatMap(file.file, setId);

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
					for (let i = 0; i < music.duration; i += 10) {
						timedHitObjectsCollection.push(
							x[2].filter((x2) => x2[1] > i - 5 && x2[1] < i + 15)
						);
						timedSlidersCollection.push(
							timedHitObjectsCollection[timedHitObjectsCollection.length - 1].filter(
								(x) => x[0] < 4 && x[0] > 0
							  ))
					}
					setLen(x[2].length)
					setApproachRate(x[0]);
					setCircleSize(x[1]);
					setTimingPoints(x[3]);
					setColors(x[4]);
					setTime(0);
					//music.currentTime=music.duration-5
					music.play();
					if (x[5]) {
						backgroundVideo.play();
					}
					
					let pointerIndex = -1;
					let t = 0;
					while (music.currentTime < music.duration) {
						t = parseFloat(music.currentTime.toFixed(2));
						if (pointerIndex!=parseInt(t/10)) {
							pointerIndex = parseInt(t/10);
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
					
					if(music.currentTime>=music.duration){
						if (x[5]) {
							backgroundVideo.pause();
							backgroundVideoSource1.src =""
							backgroundImage.style.display = "";
							await new Promise((resolve) => {
								setTimeout(() => {
									resolve();
								}, 10);
							});
							backgroundImage.style.opacity = 1;
						}
						setStart(false)
					}
					
				};
		};
		setTimeout(() => {
			//load.style.opacity=0
		}, 1000);
	}, []);
	let getPoints = (x) => {
		return x[3][0];
	};
	let sliders=timedSliders.map((x, i) =>
	<g
	key={"slider" + x[2]}
	  className=" fixed"
	  style={{
		zIndex:len-x[2]+30,
		display: time - x[1] > 0 ? "" : "none",
		animation:
		  "sliderFadeIn " +
		  approachRate +
		  "s linear 0s 1 forwards , sliderFadeOut " +
		  approachRate / 4 +
		  "s linear " +
		  ((approachRate * 3) / 4 + x[5] * x[6]) +
		  "s 1 forwards  ",
	  }}
	>
	  <path
		onClick={(e) => {
		}}
		strokeLinecap="round"
		className="  pointer-events-auto"
		d={x[3]}
		strokeWidth={circleSize + 26}
		stroke={"rgb(" + colors[x[2]] + ")"}
		fill="transparent"
		style={{ zIndex: 30  }}
	  />
	  <path
		onClick={(e) => {
		}}
		strokeLinecap="round"
		className="brightness-75 dura pointer-events-auto"
		d={x[3]}
		strokeWidth={circleSize + 22}
		stroke="#252525ee"
		fill="transparent"
		style={{ zIndex: 30  }}
	  />
	</g>)
	let points = timedHitObjects.map((x, i) =>
		x[0] == 0 ? (
			<div
				key={"hit" + x[2]}
				className=" absolute fadex opacity-0 aspect-square flex items-center justify-center text-bact  rounded-full outline outline-4 bg-post bg-opacity-50 pointer-events-none"
				style={{
					zIndex:len-x[2]+50,
					top: x[3][1],
					left: x[3][0],
					height: circleSize + "px",
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
					zIndex:len-x[2]+50,
					
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
	let md4=music.duration/4
	return (
		<>
			
			<div className="w-full h-full  flex flex-col justify-center items-center  fixed"
			style={{
				
				
			}}
			id="playArea"
			>
			
				<div 
					className="fixed flex flex-col justify-center items-center  "
					style={{
						transform:
							"scale(" +
							window.innerHeight / (384 +circleSize*3) +
							")",
						
						height: 384 + circleSize*3 + "px",
						width: 512 + circleSize*3 + "px"
					}}>
					
					
					<svg
						key={"scresen"}
						className="absolute w-full h-full    pointer-events-none"
						style={{
							
							
						
							
						
						
						
											}}
						fill="black"
						xmlns="http://www.w3.org/2000/svg"
						id="svghold">
							{sliders}
						
					</svg>
					{points}
				</div>
				<div
					className="fixed z-40 rounded-full top-0 left-0 h-2 bg-colors-green"
					style={{
						width:(parseFloat(time-md4*3) / (md4)) * 100 + "%",
					}}></div>
					<div
					className="fixed z-40 rounded-full top-0 right-0 w-2 bg-colors-green"
					style={{
						height:(parseFloat(time) / (md4)) * 100 + "%",
					}}></div>
					<div
					className="fixed z-40 rounded-full bottom-0 right-0 h-2 bg-colors-green"
					style={{
						width:(parseFloat(time-md4) / (md4)) * 100 + "%",
					}}></div>
					<div
					className="fixed z-40 rounded-full  bottom-0 left-0 w-2 bg-colors-green"
					style={{
						height:(parseFloat(time -2*md4) / (md4)) * 100 + "%",
					}}></div>
			</div>
			
		</>
		
	);
}

export default PlayArea;
