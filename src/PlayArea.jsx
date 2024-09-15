import { useEffect, useState } from "react";
import { backgroundImage, decodeBeatMap, music } from "./Utils";
function PlayArea({ setId = 0, id = 0, setStart }) {
	const [approachRate, setApproachRate] = useState(0);
	const [hpDrain, setHpDrain] = useState(0);
	const [circleSize, setCircleSize] = useState(0);
	const [timedHitObjects, setTimedHitObjects] = useState([]);
	const [timedSliders, setTimedSliders] = useState([]);
	const [timingPoints, setTimingPoints] = useState([]);
	const [colors, setColors] = useState([]);
	const [time, setTime] = useState(0.01);
	let delay = 0;
	useEffect(() => {
		console.log(setId, id);
		music.currentTime = 0;
		const request = indexedDB.open("osuStorage", 2);
		request.onsuccess = function (event) {
			//console.log("Success: " + event.type);
			const db = event.target.result;
			db.transaction("Files").objectStore("Files").get(setId).onsuccess =
				async function (event) {
					const file = event.target.result.files.find(
						(x) => x.id == id
					);
					console.log("bef");
					let x = await decodeBeatMap(file.file, setId);
					console.log("bef3");

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
					setApproachRate(x[0]);
					setCircleSize(x[1]);
					setTimingPoints(x[3]);
					setColors(x[4]);
					setTime(0);
					music.play();
					if (x[5]) {
						backgroundVideo.play();
					}
					let counter = 0;
					let pointerIndex = 0;
					let t = 0;
					while (music.currentTime < music.duration) {
						t = parseFloat(music.currentTime.toFixed(2));
						if (counter == 0) {
							setTimedHitObjects(
								timedHitObjectsCollection[pointerIndex]
							);
							setTimedSliders(
								timedSlidersCollection[pointerIndex]
							);
							pointerIndex++;
						}
						setTime(t);
						counter = (counter + 1) % 1000;
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
					if (x[5]) {
						backgroundVideo.pause();
						backgroundImage.style.display = "";
						await new Promise((resolve) => {
							setTimeout(() => {
								resolve();
							}, 10);
						});
						backgroundImage.style.opacity = 1;
					}
					setStart(false);
				};
		};
		setTimeout(() => {
			//load.style.opacity=0
		}, 1000);
	}, []);
	let getPoints = (x) => {
		//console.log(x)
		return x[3][0];
	};
	let sliders=timedSliders.map((x, i) =>
	<g
	key={"slider" + x[2]}
	  className=" "
	  style={{
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
		  //console.log("clicked");
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
		  //console.log("clicked");
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
					zIndex: 10, //+ (leny - x[2]),
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
				className=" absolute fadex duration-150 opacity-0  aspect-square flex items-center justify-center text-bact  rounded-full outline outline-4 bg-post bg-opacity-50 pointer-events-none"
				style={{
					zIndex: 10, //+ (leny - x[2]),
					
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
	return (
		<>
			
			<div className="w-full h-full flex flex-col items-center justify-center fixed"
			style={{
				marginTop: -circleSize/2 +"px",
			}}
			>
			<svg
						key={"scresen"}
						className=" h-96   aspect-[4/3]  pointer-events-none"
						style={{
							paddingTop: circleSize/2 +"px",
							paddingLeft: circleSize*0.65  +"px",

							transform:
							"scale(" +
							window.innerHeight / (384 + 2*circleSize) +
							")",
						height: 384 + circleSize*2 + "px",
						marginTop:circleSize/2 +"px",
						marginBottom:-(384 + circleSize*1.5) + "px",						}}
						fill="black"
						xmlns="http://www.w3.org/2000/svg"
						id="svghold">
							{sliders}
						{/*<path className='pointer-events-none hidden' d="M 492 224 Q 466 267 396 271 Q  348 230 350 174" fill='none' strokeWidth={1  } stroke="rgba(0,0,0,1)"/>
      <path className='pointer-events-none hidden' d="M 492 224 S 466 267 396 271  348 230 350 174" fill='none' strokeWidth={1  } stroke="rgba(0,200,0,1)"/>
      <path className='pointer-events-none hidden' d={"M 492 224 C "+getControlPoints([466, 267],[ 396, 271],[  348 ,230],1)+" 350 174 " +help.bSliderPath([[350,174],[335,201]])} fill='none' strokeWidth={1  } stroke="rgba(200,200,0,1)"/>*/}
					</svg>
				<div
					className="h-96  aspect-[4/3] bg-post  bg-opacity-0"
					style={{
						transform:
							"scale(" +
							window.innerHeight / (384 + 2*circleSize) +
							")",
						height: 384 + circleSize + "px",
					}}>
					
					<div className=" aspect-square bg-bl ack top-0 absolute left-0"
					style={
						{
							width: circleSize + "px",
							
						}
					
					}
					></div>
					<div className=" aspect-square bg-b lack top-96 absolute left-0"
					style={
						{
							width: circleSize + "px",
							
						}
					
					}
					></div>
					{points}
				</div>
				<div
					className="absolute top-0 left-0 h-2 bg-colors-green"
					style={{
						width: (time / music.duration) * 100 + "%",
					}}></div>
			</div>
		</>
	);
}

export default PlayArea;
