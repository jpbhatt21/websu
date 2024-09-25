import { play } from "./Utility/Utils";
import { svg } from "./Utility/VectorGraphics";

function PauseScreen({setStart,setAttempts}) {
	return (
		<div
			id="pauseMenu"
			className="w-full h-full z-[9999] flex flex-row-reverse justify-center gap-5 text-xl font-bold items-center text-[#b3b3b3]  fixed bg-black bg-opacity-50 opacit y-0 duration-300 backdrop-blur-md pointer-events-none opacity-0">
			<div
				onClick={async () => {
					pauseMenu.style.opacity = "0";
					pauseMenu.style.pointerEvents = "none";
					if (backgroundVideoSource1.src != "") {
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
				}}
				className="w-16 h-16 bg-post flex  items-center justify-center outline outline-1 bg-opacity-50 outline-colors-red rounded-md text-center leading-[3.6rem]">
				{svg.exitIcon}
			</div>
			<div
				onClick={() => {
					pauseMenu.style.opacity = "0";
					pauseMenu.style.pointerEvents = "none";
					setStart(false);
					setAttempts(prev=>prev + 1);
					setTimeout(() => {
						setStart(true);
					}, 10);
				}}
				className="w-16 h-16 bg-post outline outline-1 bg-opacity-50 outline-colors-yellow rounded-md text-center leading-[3.6rem]">
				{svg.replayIcon}
			</div>
			<div
				onClick={() => {
					pauseMenu.style.opacity = "0";
					pauseMenu.style.pointerEvents = "none";
					setTimeout(() => {
						play();
					}, 1000);
				}}
				className="w-16 h-16 bg-post outline outline-1 bg-opacity-50 outline-colors-green rounded-md text-center leading-[3.6rem]">
				{svg.playIcon2}
			</div>
		</div>
	);
}

export default PauseScreen;
