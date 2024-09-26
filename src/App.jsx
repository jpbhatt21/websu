import SongSelectionMenu from "./SongSelectionMenu";
import { useState } from "react";
import { music } from "./Utility/Utils";
import { setSettings, settings } from "./SettingsValues";
import { bezier } from "./PlayArea";
export const uri = "https://websu-back.jpbhatt.tech";
export const uri2 = "https://catboy.best";
window.localStorage.getItem("settings") == null ? window.localStorage.setItem("settings", JSON.stringify(settings)) : setSettings( JSON.parse(window.localStorage.getItem("settings")));
window.addEventListener("blur", async (event) => {
	while(music.volume>bezier(settings.Audio["Master Volume (Window Inactive)"].value/100*settings.Audio["Music Volume"].value/100)&&music.volume>0.025){
		music.volume-=0.025
		await new Promise((r) => setTimeout(r, 10));
	}
	if(music.volume<0.05){
		music.volume=0
	}
});
window.addEventListener("focus", async  (event) => {
	while(music.volume<bezier(settings.Audio["Master Volume"].value/100*settings.Audio["Music Volume"].value/100)&&music.volume<0.975){
		music.volume+=0.025
		await new Promise((r) => setTimeout(r, 10));

	}
});
function App() {
	const [limit, setLimit] = useState(0);
	return (
		<>
		<SongSelectionMenu/>
			
		</>
	);
}

export default App;
