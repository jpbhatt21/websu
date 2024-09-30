import { useEffect, useState } from "react";

function Confirm({ props }) {
	let height = (window.innerHeight / 2) ;
	let width = (window.innerWidth / 4) * 3;
	const [clearing, setClearing] = useState(0);
	let generateRandom4Points = () => {
		let points = [];
		for (let i = 0; i < 4; i++) {
			points.push([Math.random() * width, Math.random() * height]);
		}
		return points;
	};
	const [points, setPoints] = useState(generateRandom4Points());
	const [clicked, setClicked] = useState(0);
	useEffect(() => {
		if (clicked == 4) {
			props.resetFunction.function();
            setTimeout(() => {
                setClicked(5);},10)
			setTimeout(() => {
				window.location.reload();
			}, 10000);
		}
	}, [clicked]);
	return (
		<div    id="resetConfirm"
			className="flex fade-in flex-col items-center  duration-300 w-full h-full bg-blank bg-opacity-20 backdrop-blur-md fixed"
			style={{
				animationDuration: "0.5s",
			}}
			onClick={(e) => {
				if (e.target != e.currentTarget) return;
				e.currentTarget.style.opacity = "0";
				setTimeout(() => {
					props.setResetFunction(null);
				}, 300);
			}}>
			<div className="text-bact text-[3vh] lexend mt-[10vh]  font-semibold">
				This action is{" "}
				<span className="text-colors-red">not reversible</span>
			</div>
			<div className="text-bact text-[2vh] montserrat  font-semibold">
				Click the numbers in order to confirm
			</div>
			<div className="text-bact text-[2vh] montserrat  font-semibold">
				Page will reload on confirmation
			</div>
			<div className="absolute  bottom-1 text-bcol text-[2vh] montserrat  font-semibold">
				Click anywhere else to cancel
			</div>
			{points.map((point, index) => {
				return (
					<div
						key={index + "confirm"}
						onClick={(e) => {
							if (clicked == index) {
								setClicked((prev) => prev + 1);
							} else {
								setClicked(0);
								setPoints(generateRandom4Points());
							}
						}}
						className="absolute h-[15vh] -translate-x-1/2 -translate-y-1/2 aspect-square duration-300 flex items-center justify-center  rounded-full"
						style={{
							top: point[1]+height/2,
							left: point[0]+width/8,
							background: "url('/hitcircle.png')",
							backgroundSize: "cover",
							backgroundPosition: "center",
							zIndex: 10 - index,
							opacity: clicked <= index ? "1" : "0",
							pointerEvents: clicked <= index ? "auto" : "none",
							mixBlendMode: "multiply",
							
						}}>
						<div
							className="h-1/4 pointer-events-none aspect-square"
							style={{
								background:
									"url('/Numbers/" + (index + 1) + ".png')",
								backgroundSize: "contain",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
							}}></div>
					</div>
				);
			})}
			{clicked == 5 ? (
				<div
					id="opq"
					className="w-full fixed z-50 h-full fade-in text-bact lexend flex flex-col gap-1 items-center justify-center text-[3vh] bg-blank duration-1000 ">
					<div className="">Clearing...</div>
					<div className="w-1/4 h-2 bg-ltpost rounded-full overflow-hidden">
						<div
							id="opqbar"
							className="w-full  duration-300  fill-up h-full bg-colors-red rounded-full"></div>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default Confirm;
