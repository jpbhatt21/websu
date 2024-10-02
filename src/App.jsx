import { useState } from "react";
import { initializeMusic, loadingBar, music } from "./Utility/Utils";
import { setSettings, settings } from "./SettingsValues";
import { bezier } from "./Screens/PlayArea";
import ScreenManager from "./Screens/ScreenManager";
import Credits from "./Screens/Credits";
export const uri = "https://websu-back.jpbhatt.tech";
export const uri2 = "https://catboy.best";

window.localStorage.getItem("settings") == null
	? window.localStorage.setItem("settings", JSON.stringify(settings))
	: setSettings(JSON.parse(window.localStorage.getItem("settings")));
window.addEventListener("blur", async () => {
	while (
		music.volume >
			bezier(
				((settings.Audio["Master Volume (Window Inactive)"].value /
					100) *
					settings.Audio["Music Volume"].value) /
					100
			) &&
		music.volume > 0.025
	) {
		music.volume -= 0.025;
		await new Promise((r) => setTimeout(r, 10));
	}
	if (music.volume < 0.05) {
		music.volume = 0;
	}
});
window.addEventListener("focus", async () => {
	while (
		music.volume <
			bezier(
				((settings.Audio["Master Volume"].value / 100) *
					settings.Audio["Music Volume"].value) /
					100
			) &&
		music.volume < 0.975
	) {
		music.volume += 0.025;
		await new Promise((r) => setTimeout(r, 10));
	}
});
function App() {
	const [clicked, setClicked] = useState(false);
	return (
		<>
			<ScreenManager startApp={clicked} />
			{!clicked ? (
				<div
					onClick={async (e) => {
						if (loadingBar < 100) return;
						await initializeMusic();
						cts.style.opacity = 0;
						// if(settings.User_Interface["Toggle_Fullscreen"].value==0){
						// 	document.documentElement.requestFullscreen();

						// }
						setTimeout(async () => {
							music.play();

							while (music.currentTime <= 0.1) {
								await new Promise((resolve) =>
									setTimeout(resolve, 10)
								);
							}
							setClicked(true);
						}, 300);
					}}
					className="w-full bg-blank lexend h-full gap-2 flex-col fixed flex text-3xl items-center justify-center text-bact">
					<div id="cts" className="duration-300 opacity-0">
						click to start
					</div>
					<div className="w-1/4 h-2 duration-300  bg-post rounded-full overflow-hidden">
						<div
							id="loadBar"
							className="  duration-300  h-full bg-bact rounded-full"
							style={{
								width: loadingBar + "%",
							}}></div>
					</div>
				</div>
			) : (
				<></>
			)}
			
			
		</>
	);
}

export default App;
