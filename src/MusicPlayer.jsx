import { useEffect, useState } from "react";
import { music, pauseButton, playButton } from "./Utils";

function MusicPlayer() {
	const [songName, setSongName] = useState("-");
	const [musicPlayState, setMusicPlayState] = useState(false);
	const [musicCurrentTime, setMusicCurrentTime] = useState(0);
	const [musicDuration, setMusicDuration] = useState(0);
	const [muteUnmute, setMuteUnmute] = useState(false);
	useEffect(() => {
		setInterval(() => {
				setMusicPlayState(music.paused);
			setMusicCurrentTime(music.currentTime);
			if (music.duration != musicDuration && music.duration > 0)
				setMusicDuration(music.duration);
			else setMusicDuration(0);
			setMuteUnmute(music.muted);
		}, 100);
	}, []);
	return (
		<div className="h-full text-[1.5svh] gap-1 flex  flex-col items-ce nter text-bcol  justify-center aspect-square  absolute left-2">
			<div id="songName">{songName}</div>
			<div className="h-[15%] gap-1 flex items-center">
				<div id="musicPlayState mt-1" className="h-[200%]"
                onClick={() => {
                    if (musicPlayState) {
                        music.play();
                    } else {
                        music.pause();
                    }
                }}
                >{musicPlayState ?playButton  : pauseButton }</div>
				<div id="musicCurrentTime">
					{(musicCurrentTime / 60<10?"0":"")+parseInt(musicCurrentTime / 60) +
						":" +(musicCurrentTime % 60<10?"0":"")+
						parseInt(musicCurrentTime % 60)}
				</div>
				<div className="bg-gray-500   h-full rounded-lg  w-[20vw]"
                onClick={(e) => {
                    music.currentTime =
                        (e.clientX - e.target.getBoundingClientRect().left) /
                        e.target.getBoundingClientRect().width *
                        music.duration;
                }}
                >
					<div
						id="musicProgress"
						className="-ml-[1px] max-w-[100%] pointer-events-none duration-300 bg-slate-100 w-1/2 h-full rounded-lg"
						style={{
							width:
								(musicCurrentTime / musicDuration) * 100 + "%",
						}}></div>
				</div>
				<div id="musicDuration">
					{(musicDuration / 60<10?"0":"")+parseInt(musicDuration / 60) +
						":" +(musicDuration % 60<10?"0":"")+
						parseInt(musicDuration % 60)}
				</div>
				<div id="muteUnmute"
                onClick={() => {
                    music.muted = !music.muted;
                }}
                >{muteUnmute ? "0" : "1"}</div>
			</div>
		</div>
	);
}

export default MusicPlayer;
