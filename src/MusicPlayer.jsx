import { useEffect, useState } from "react";
import { music } from "./Utils";
import { svg } from "./VectorGraphics";
function MusicPlayer() {
	const [songName, setSongName] = useState("-");
	const [musicPlayState, setMusicPlayState] = useState(false);
	const [musicCurrentTime, setMusicCurrentTime] = useState(0);
	const [musicDuration, setMusicDuration] = useState(0);
	const [muteUnmute, setMuteUnmute] = useState(false);
	const [inter, setInter] = useState(false);
	async function keyaction2(e) {
		if (!inter && music.paused) {
			try {
				
				music.play();
				music.volume = 0;
				while (music.volume <= 0.9) {
					music.volume += 0.1;
					await new Promise((r) => setTimeout(r, 10));
				}
				music.volume = 1;
				if (music.paused) return;
				setInter(true);

				
			} catch (e) {}
		}
	}
	useEffect(() => {
		document.addEventListener("click", keyaction2);
		setInterval(() => {
			setMusicPlayState(music.paused);
			if(!music.paused){
				document.removeEventListener("click", keyaction2);
			}
			if (!inter && !music.paused) setInter(true);
			if (!music.paused) {
				clickToUnmute.style.opacity = "0";
				clickToUnmute.style.height = "0";
			}
			setMusicCurrentTime(music.currentTime);
			if (music.duration != musicDuration && music.duration > 0)
				setMusicDuration(music.duration);
			else setMusicDuration(0);
			if (music.title != "") setSongName(music.title);
			setMuteUnmute(music.muted);
		}, 300);
	}, []);
	return (
		<>
			<div className=" text-[1vh] pt-[0.5vh]  flex gap-1  items-ce nter text-bcol  justify-center aspect-square h-[60px] min-h-[5vh] max-h-[10vh]  absolute left-2">
				<div className="h-full w-[4vh]  select-none items-center justify-evenly flex flex-col">
					<div
						id="musicPlayState mt-1" //Play-Pause button
						className="h-1/3"
						onClick={() => {
							if (musicPlayState) {
								music.play();
							} else {
								music.pause();
							}
						}}>
						{musicPlayState ? svg.playIcon : svg.pauseIcon}
					</div>
					<div id="musicCurrentTime" className="h-1/3 flex text-[125%] mb-[0.25vh] items-center justify-center text-center w-[4vh]" //Music current time in mm:ss
					>
						{(musicCurrentTime / 60 < 10 ? "0" : "") +
							parseInt(musicCurrentTime / 60) +
							":" +
							(musicCurrentTime % 60 < 10 ? "0" : "") +
							parseInt(musicCurrentTime % 60)}
					</div>
				</div>
				<div className="h-full w-[20vh]  justify-evenly   flex flex-col">
					<div id="songName" className="h-1/3 text-[150%] w-full overflow-hidden text-ellipsis whitespace-nowrap  flex items-center" //Song name
					>{songName}</div>
					<div className="h-1/3 flex items-center ">
                    <div
						className="bg-bdark overflow-hidden out line outl ine-1  h-1/2 rounded-full  w-full" //Seek-bar background
						onClick={(e) => {
							music.currentTime =
								((e.clientX -
									e.target.getBoundingClientRect().left) /
									e.target.getBoundingClientRect().width) *
								music.duration;
						}}>
						<div
							id="musicProgress"
							className=" max-w-[100%] pointer-events-none duration-300 bg-gray-200 w-0 h-full rounded-full" //Seek-bar
							style={{
								width:
									(musicCurrentTime / musicDuration) * 100 +
									"%",
							}}></div>
					</div>
                    </div>
				</div>
				<div className="h-full w-[4vh] select-none  items-center justify-evenly   flex flex-col">
					<div
						id="muteUnmute" //Mute-Unmute Button
						className="h-1/3 flex duration-300 items-center "
						style={{
							color: muteUnmute || !inter ? "#9393934C" : "",
						}}
						onClick={() => {
							if(!inter)return
							music.muted = !music.muted;
						}}>
						{svg.unmuteIcon}
						<div
							style={{
								height: muteUnmute || !inter ? "" : "0%",
							}}
							className="h-[110%] bg-bact duration-300 rounded-sm aspect-[1/10] rotate-45 -ml-[50%]"></div>
					</div>
					<div id="musicDuration" className="w-[4vh] flex text-[125%] mb-[0.25vh] items-center justify-center text-center h-1/3" //Music Duration in mm:ss
					>
						{(musicDuration / 60 < 10 ? "0" : "") +
							parseInt(musicDuration / 60) +
							":" +
							(musicDuration % 60 < 10 ? "0" : "") +
							parseInt(musicDuration % 60)}
					</div>
				</div>
				{false ? (
					<>
						<div className="h-[15%] gap-1 flex items-center"></div>
					</>
				) : (
					<></>
				)}
			</div>
		</>
	);
}

export default MusicPlayer;
