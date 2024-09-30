import { useEffect, useState } from "react";
import Intro from "../Components/Intro";
import { fakeClick, music } from "../Utility/Utils";
import { svg } from "../Utility/VectorGraphics";
let colors = {
	screenBackground: [
		"#11292b",
		"#1d1419",
		"#546284",
		"#0e1322",
		"#adadad",
		"#220c18",
		"#8c436a",
		"#112826",
	],
	backgrond: [
		"#183837",
		"#292125",
		"#617ea8",
		"#1b2a3d",
		"#cccccc",
		"#361728",
		"#b26b92",
		"#153631",
	],
	outline: [
		"#142d31",
		"#221a1e",
		"#5166a0",
		"#0f1322",
		"#a7a7a7",
		"#26111d",
		"#954c73",
		"#112527",
	],
	faded: [
		"#142d2f",
		"#241d21",
		"#5172a0",
		"#101b29",
		"#b1b1b1",
		"#2b111f",
		"#a35880",
		"#132b27",
	],
	colored1: [
		"#92c2cf",
		"#9a6f37",
		"#b49286",
		"#b984b4",
		"#834a6c",
		"#a47964",
		"#b480ab",
		"#557078",
	],
	colored2: [
		"#ba98b7",
		"#428075",
		"#a0816d",
		"#89ab96",
		"#a57d96",
		"#af5b76",
		"#bee5ca",
		"#947f9a",
	],
};
let context = null;
let source = null;
let anazlyzer = null;
let bufferLength = null;
let skewDeg = 8;
function MainMenu({ props }) {
	if (!context) {
		context = new AudioContext();
		source = context.createMediaElementSource(music);
		anazlyzer = context.createAnalyser();
		source.connect(anazlyzer);
		anazlyzer.connect(context.destination);
		anazlyzer.fftSize = 64;
		bufferLength = anazlyzer.frequencyBinCount;
	}
	const [ind, setInd] = useState(parseInt(Math.random() * 8));
	let audioVisualizerHeight = (window.innerWidth / 2) * 0.53125;
	let logoHeight = ((window.innerWidth / 2) * 2) / 3;
	let audioVisualizerBarWidth = 0.0314 * audioVisualizerHeight;
	let barHeight = audioVisualizerHeight / 8;
	let top = 50;
	function keyaction(e) {
		if (e.key == "Escape") {
			try{
				if (document.getElementById("settingsPage")) {
					stb.click();
					return
			}}
			catch(e){}
			if (horizontalMenu.style.width == "100%") {
				logoClickScaler.style.scale = "100%";
				setLeft(0);
				horizontalMenu.style.width = "0%";
				props.setShowTopBar(false);
			}
			
		}
	}
	useEffect(() => {
		let init = ind;
		let randint;

		setInterval(() => {
			randint = parseInt(Math.random() * 8);
			while (randint == init) {
				randint = parseInt(Math.random() * 8);
			}
			init = randint;
			setInd(init);
		}, 30000);
		setTimeout(
			() => {
				document.addEventListener("keydown", keyaction);
				let children = audioVisva.children;
				let data = new Uint8Array(bufferLength);
				let avg = 0;
				let val = 0;
				setInterval(() => {
					anazlyzer.getByteFrequencyData(data);
					avg = data.reduce((a, b) => {
						return a + b;
					}, 0);
					avg /= 32;
					avg = 0.75 + avg / 512;
					for (let i = 0; i < 25; i++) {
						val = (data[i + 3] / 255) * barHeight + "px";
						children[i].style.height = val;
						children[i + 25].style.height = val;
						children[i + 50].style.height = val;
						children[i + 75].style.height = val;
					}
					children[100].style.height =
						(data[3] / 255) * barHeight + "px";
					setLogoScale(avg);
				}, 0);
			},
			props.initLoad ? 3000 : 100
		);
	}, []);
	const [left, setLeft] = useState(0);
	const [clickScale, setClickScale] = useState(1);
	const [logoScale, setLogoScale] = useState(1);
	if (left != 0 && !props.showTopBar) setLeft(0);
	return (
		<>
			<div
				id="mainMenuScr"
				className="w-full fade-in fixed h-full flex duration-[10s] items-center text-white justify-center"
				style={{
					backgroundColor: colors.screenBackground[ind],
				}}>
				<div
					className="w-full pointer-events-none h-full"
					style={{
						background:
							"linear-gradient(45deg ,#1b1b1b00,#00000000)",
					}}></div>
				<svg
					viewBox="0 0 1920 1080"
					className="min-w-full pointer-events-none  top-0 fixed min-h-full"
					xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient
							id="grad1"
							x1="0%"
							x2="100%"
							y1="0%"
							y2="100%">
							<stop
								className=" duration-[10s]"
								offset="0%"
								stopColor={colors.backgrond[ind]}
							/>
							<stop
								className=" duration-[10s]"
								offset="100%"
								stopColor={colors.backgrond[ind] + "4C"}
							/>
						</linearGradient>
					</defs>
					<path
						d="M465,1081 415,990 475,990 425,900 390,950 320,825 235,970 115,760 270,760 140,530 65,665 30,615 10,660 
					   -1,640 -1,505 300,505 255,430 340,430 210,205 165,280 105,175 280,175 245,230 355,230 320,175 400,175 300,-1 
					   375,-1 350,40 585,40 570,65 675,65 635,-1 
					   610,-1 600,15 590,-1
					   1705,-1 1755,85 1805,-1
					   1590,-1 1520,125 1730,125
					   1700,170 1770,170 1675,325 1835,325
					   1760,450 1740,420 1720,450 1680,380 1624,475 1710,475
					   1685,515 1795,515 1775,475 1830,475
					   1685,725 1613,600 1480,825 1580,825
					   1555,865 1605,865
					   1480,1081 1445,1081
					   1355,910 1265,1081 795,1081
					   743,990 700,1065 680,1025 650,1081 465,1081

					"
						className=" duration-[10s]"
						stroke={colors.outline[ind]}
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill={"url(#grad1)"}
					/>
					<path
						d="M445,1040 590,820 723,1018 
					M456,950 590,950 480,775 385,935
					M450,510 355,690 550,690 450,510
					M360,430 260,605 460,605 360,430
					M275,510 250,555 300,555 275,510
					M405,200 310,365 505,365 405,200
					M720,850 645,970 790,970 720,850
					M845,985 795,1070 895,1070 845,985
					M1145,1080 1250,885 1315,980 
					M1297,1015 1260,1015 1435,715 1487,807
					M1498,828 1565,930
					M1415,1015 1514,1015
					M1570,835 1410,835 1500,685 1528,738
					M1607,605 1460,605 1550,460 1630,605 1619,605
					M1480,420 1415,535 1545,535 1480,420
					M1495,145 1360,375 1630,375 1495,145
					M1605,128 1525,260 1712,260 
					M1733,225 1675,128
					M1580,130 1625,200 1220,200 1340,0
					M1510,0 1548,69
					M1325,0 1375,85 1150,85 1200,0
					M850,0 900,85 675,85 725,0
					M667,47 680,25 770,175 595,175 658,68
					M312,233 285,270 640,270 502,43 
					M420,43 373,122
					M343,178 334,193
					"
						className=" duration-[10s]"
						stroke={colors.faded[ind]}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					/>
					<path
						d="
					M775,685 680,840 860,840 775,685 
					M840,745 805,805 875,805 840,745
					M945,865 910,925 980,925 945,865
					M688,610 605,750 771,750 688,610
					M600,555 550,635 650,635 600,555
					M1080,720 980,890 1180,890 1080,720
					M1185,625 1085,800 1285,800 1185,625
					M1210,610 1145,725 1275,725 1210,610
					M1320,600 1285,655 1355,655 1320,600
					M1275,500 1235,575 1315,575 1275,500 
					M1200,480 1170,535 1230,535 1200,480
					M1290,360 1235,455 1345,455 1290,360
					M1185,255  1085,425 1285,425 1185,255
					
					"
						className=" duration-[10s]"
						stroke={colors.colored1[ind]}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					/>
					<path
						d="
					M1100,175 1045,270 1155,270 1100,175
					M995,160  960,225 1035,225 995,160
					M920,190 860,295 980,295 920,190
					M785,195 750,255 820,255 785,195
					M805,320 760,400 850,400 805,320
					M760,350 690,475 830,475 760,350
					M695,300 615,445 780,445 695,300
					M655,455 615,525 695,525 655,455
					"
						className=" duration-[10s]"
						stroke={colors.colored2[ind]}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					/>
				</svg>
				<div className="w-full h-full duration-300 fixed flex items-center justify-center">
					<div
						id="horizontalMenu"
						className="w-0 h-1/6 bg-post duration-300 flex bg-opacity-75 overflow-hidden  ">
						<div className="h-full  w-[20vw]"></div>
						<div
							className="h-full hover:-ml-[5vw] group flex items-center justify-center pr-[5vw] hover:w-[20vw] w-[15vw] duration-300  shadow-md  bg-ltpost "
							onClick={() => {
								stb.click();
							}}
							style={{
								transform:
									"skew(-" +
									skewDeg +
									"deg,-" +
									skewDeg +
									"deg) rotate(" +
									skewDeg +
									"deg)",
							}}>
							<div
								className="w-[10vw] h-full flex flex-col items-center justify-center"
								style={{
									transform:
										"skew(" +
										skewDeg +
										"deg," +
										skewDeg +
										"deg) rotate(-" +
										skewDeg +
										"deg)",
								}}>
								<div className="h-1/3  bop duration-300  aspect-square">
									{svg.settingsIcon}
								</div>
								<div className=" text-lg">Settings</div>
							</div>
						</div>
						<div
							className="h-full  w-[15vw] hover:w-[20vw] group flex items-center justify-center pl-[5vw] duration-300 shadow-md  bg-colors-green"
							onClick={() => {
								document.removeEventListener("keydown", keyaction);
								props.setAddSongMenuEventListener(true);
								mainMenuScr.style.transitionDuration = "0.5s";
								mainMenuScr.style.opacity = 0;
								fakeClick(0, true);
								setTimeout(() => {
									props.setShowHome(false);
								}, 500);
							}}
							style={{
								transform:
									"skew(-" +
									skewDeg +
									"deg,-" +
									skewDeg +
									"deg) rotate(" +
									skewDeg +
									"deg)",
							}}>
							<div
								className="w-[10vw] h-full flex flex-col items-center justify-center"
								style={{
									transform:
										"skew(" +
										skewDeg +
										"deg," +
										skewDeg +
										"deg) rotate(-" +
										skewDeg +
										"deg)",
								}}>
								<div className="h-1/3  bop duration-300 aspect-square">
									{svg.playIcon}
								</div>
								<div className=" text-lg">Play</div>
							</div>
						</div>
						<div
							className="h-full -ml-[0.5vw] w-[10vw] group  hover:w-[15vw] flex items-center justify-center duration-300 shadow-md  bg-colors-purple"
							style={{
								transform:
									"skew(-" +
									skewDeg +
									"deg,-" +
									skewDeg +
									"deg) rotate(" +
									skewDeg +
									"deg)",
							}}>
							<div
								className="w-[10vw] h-full flex flex-col items-center justify-center"
								style={{
									transform:
										"skew(" +
										skewDeg +
										"deg," +
										skewDeg +
										"deg) rotate(-" +
										skewDeg +
										"deg)",
								}}>
								<div className="h-1/3 bop duration-300 aspect-square">
									{svg.infoIcon}
								</div>
								<div className=" text-lg">Credits</div>
							</div>
						</div>
						<div
							className="h-full -ml-[0.5vw] w-[10vw] group  hover:w-[15vw] flex items-center justify-center duration-300 shadow-md  bg-colors-red"
							style={{
								transform:
									"skew(-" +
									skewDeg +
									"deg,-" +
									skewDeg +
									"deg) rotate(" +
									skewDeg +
									"deg)",
							}}>
							<div
								className="w-[10vw] h-full flex flex-col items-center justify-center"
								style={{
									transform:
										"skew(" +
										skewDeg +
										"deg," +
										skewDeg +
										"deg) rotate(-" +
										skewDeg +
										"deg)",
								}}>
								<div className="h-1/3 bop duration-300 aspect-square">
									{svg.crossIcon2}
								</div>
								<div className=" text-lg">Exit</div>
							</div>
						</div>
					</div>
				</div>
				<div
					id="logoClickScaler"
					className={"duration-300 transition-all pointer-events-auto   hover:brightness-110  hover:scale-[1.15] fixed "+(props.initLoad?" badum2":"")}
					style={{
						marginLeft: -left + "%",
					}}>
					<div
						id="audioVisva"
						className=" pointer-events-none badum  aspect-square fixed"
						style={{
							height: audioVisualizerHeight * logoScale,
						}}>
						{"0"
							.repeat(101)
							.split("")
							.map((x, i) => {
								return (
									<div
									key={"av+"+i}
										className="w-3 h-12  absolute bg-[#a49bce]"
										style={{
											offsetDistance: i + "%",
											offsetAnchor: "0% 0%",
											offsetPath:
												"path('m " +
												audioVisualizerHeight *
													logoScale +
												" " +
												(audioVisualizerHeight / 2) *
													logoScale +
												" a " +
												(audioVisualizerHeight / 2) *
													logoScale +
												" " +
												(audioVisualizerHeight / 2) *
													logoScale +
												" 0 1 0 0 5')",
											width:
												audioVisualizerBarWidth *
													logoScale +
												"px",
											background:
												"linear-gradient(0deg,#a49bce4C,#a49bce)",
										}}></div>
								);
							})}
					</div>
					<div
						id="logoBop"
						className="h-2/3  pointer-events-none -translate-x-1/2 -translate-y-1/2 aspect-square fixed"
						style={{
							height: logoHeight * logoScale,
						}}>
						<svg
							viewBox="0 0 64 64"
							className=""
							xmlns="http://www.w3.org/2000/svg">
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
									fill="#6044db"
									className=" pointer-events-auto"
									onClick={(e) => {
										logoClickScaler.style.scale = "50%";
										setLeft(30);
										horizontalMenu.style.width = "100%";
										props.setShowTopBar(true);
										return;
									}}
								/>
								{/* 'w' shape */}
								<path
									d="M11.43,29v3.92a2.37,2.37,0,0,0,2.38,2.38h0a2.37,2.37,0,0,0,2.37-2.38V29"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
									transform="translate(0.875, 0)"
								/>
								<path
									d="M16.25,29v3.92a2.37,2.37,0,0,0,2.38,2.38h0a2.37,2.37,0,0,0,2.37-2.38V29"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
									transform="translate(0.875, 0)"
								/>
								{/* 'e' shape */}
								<path
									d="M28,35.3h-1.92a3.3,3.3,0,0,1-3.3-3.3v0a3.3,3.3,0,0,1,3.3-3.3H27"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
									transform="translate(0.875, 0)"
								/>
								<path
									d="M25,32.25h1.92a1.75,1.75,0,0,0,1.75-1.75v0a1.75,1.75,0,0,0-1.75-1.75H27"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
									transform="translate(0.875, 0)"
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
								/>
								{/* 's' shape */}
								<path
									d="M37.25,34.74a2.67,2.67,0,0,0,1.96,0.53h0.53a1.58,1.58,0,0,0,1.58-1.58h0a1.58,1.58,0,0,0-1.58-1.58h-1.05a1.58,1.58,0,0,1-1.58-1.58h0a1.58,1.58,0,0,1,1.58-1.58h0.53a2.67,2.67,0,0,1,1.96,0.53"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
									transform="translate(0.875, 0)"
								/>
								{/* 'u' shape */}
								<path
									d="M43.18,29v3.92a2.37,2.37,0,0,0,2.38,2.38h0a2.37,2.37,0,0,0,2.37-2.38V29"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
									transform="translate(0.875, 0)"
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
								/>
								{/* Exclamation mark '!' */}
								<circle
									cx="51"
									cy="35"
									r="0.75"
									fill="currentColor"
									transform="translate(0.875, 0)"
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
								/>
							</g>
						</svg>
					</div>
				</div>
			</div>
			<div
				className="w-full bg-white  pointer-events-none h-full fixed  opacity-0"
				style={{
					animation: props.initLoad ? (
						"fadeIn ease-in-out 1s 2.9s reverse"
					) : (
						<></>
					),
				}}></div>

			{props.initLoad ? <Intro /> : <></>}
		</>
	);
}

export default MainMenu;
