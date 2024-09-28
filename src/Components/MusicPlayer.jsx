import { useEffect, useState } from "react";
import { music } from "../Utility/Utils";
import { svg } from "../Utility/VectorGraphics";
import { settings } from "../SettingsValues";
let start = null;
let startTime= new Date()
startTime=[startTime.getHours(),startTime.getMinutes(),startTime.getSeconds()]
console.log(startTime)
let past5 = [60, 60, 60, 60, 60];
let clear = false;
let prev = null;
let mCTMin, mCTSec, mDurMin, mDurSec,pTHr,pTMin,pTSec, interaction, diff, fPS;
let interacted = false;
function repeater(time) {
	if (prev) {
		mDurSec = music.duration;
		interaction = navigator.userActivation.isActive;
		if (interaction && !interacted) {
			interacted = true;
			music.play();
			if(settings.User_Interface["Toggle_Fullscreen"].value==0){
				document.documentElement.requestFullscreen();
				navigator.keyboard.lock();
			}
			setTimeout(() => {
				clickToUnmute.style.opacity = "0";
				clickToUnmute.style.height = "0px";
			}, 100);
		}
		if (mDurSec > 0) {
			mCTSec = music.currentTime;
			musicProgress.style.marginLeft =
				-(100 - (mCTSec / mDurSec) * 100) + "%";
			mCTMin = parseInt(mCTSec / 60);
			mCTSec = parseInt(mCTSec % 60);
			musicCurrentTime.innerHTML =
				(mCTMin < 10 ? "0" : "") +
				mCTMin +
				":" +
				(mCTSec < 10 ? "0" : "") +
				mCTSec;
			mDurMin = parseInt(mDurSec / 60);
			mDurSec = parseInt(mDurSec % 60);
			musicDuration.innerHTML =
				(mDurMin < 10 ? "0" : "") +
				mDurMin +
				":" +
				(mDurSec < 10 ? "0" : "") +
				mDurSec;
			songName.innerHTML = music.title;
			if (music.paused) {
				musicPlaying.style.opacity = "0";
				musicPaused.style.opacity = "1";
			} else {
				musicPlaying.style.opacity = "1";
				musicPaused.style.opacity = "0";
			}
			if (music.muted || !interaction) {
				speakerIcon.style.color = "";
				slashLine.style.height = "100%";
			} else {
				speakerIcon.style.color = "#939393";
				slashLine.style.height = "0%";
			}
		}
		diff = time - prev;
		fPS = 1000 / diff;
		past5.shift();
		past5.push(fPS);
		fPS = past5.reduce((a, b) => a + b, 0) / 5;
		if (Math.abs(fPS - fps.innerHTML) > 5) {
			fps.innerHTML = parseInt(fPS);
			lat.innerHTML = parseInt(diff);
		}
		pTHr = parseInt(time / 3600000);
		pTMin = parseInt(time / 60000 % 3600);
		pTSec = parseInt(time / 1000 % 60);
		playTime.innerHTML = (pTHr<10?"0":"")+pTHr+":"+(pTMin<10?"0":"")+pTMin+":"+(pTSec<10?"0":"")+pTSec;
		pTHr+=startTime[0]
		pTMin+=startTime[1]
		pTSec+=startTime[2]
		if(pTSec>=60){
			pTSec-=60
			pTMin++
		}
		if(pTMin>=60){
			pTMin-=60
			pTHr++
		}
		if(pTHr>=24){
			pTHr-=24
		}
		dateTime.innerHTML = (pTHr<10?"0":"")+pTHr+":"+(pTMin<10?"0":"")+pTMin+":"+(pTSec<10?"0":"")+pTSec;
	}
	prev = time;
	
	window.requestAnimationFrame(repeater);
}
function startRepeater() {
	if (!start) window.requestAnimationFrame(repeater);
	start = true;
}
function MusicPlayer() {
	return (
		<>
			<div className=" text-sm  w-full pt-1   flex gap-1  items-center text-bcol  justify-center aspect-square h-full   ">
				<div className="h-full w-1/5 select-none -mt-[1px] items-center justify-evenly flex flex-col">
					<div
						className="h-1/3 aspect-square items-center justify-center flex flex-wrap"
						onClick={() => {
							console.log(clickToUnmute.style.height);
							if (clickToUnmute.style.height != "0px") return;

							if (music.paused) {
								music.play();
							} else {
								music.pause();
							}
						}}>
						<div
							id="musicPlaying" //Pause button
							className="h-full opacity-0  duration-300">
							{svg.pauseIcon}
						</div>
						<div
							id="musicPaused" //Play button
							className="h-full -mt-[19px] duration-300">
							{svg.playIcon}
						</div>
					</div>
					<div
						id="musicCurrentTime"
						className="h-1/3 flex  items-center justify-center text-center w-full" //Music current time in mm:ss
					>
						00:00
					</div>
				</div>
				<div className="h-full w-3/5  justify-evenly   flex flex-col">
					<div
						className="h-1/3   w-full flex items-center " //Song name
					>
						<div
							id="songName"
							className="text-lg w-full overflow-hidden lexend text-ellipsis whitespace-nowrap  ">
							
						</div>
					</div>
					<div className="h-1/3 flex items-center ">
						<div
							className="bg-bdark overflow-hidden out line outl ine-1  h-1/2 rounded-full  w-full" //Seek-bar background
							onClick={(e) => {
								music.currentTime =
									((e.clientX -
										e.target.getBoundingClientRect().left) /
										e.target.getBoundingClientRect()
											.width) *
									music.duration;
							}}>
							<div
								id="musicProgress"
								className=" w-full pointer-events-none duration-75 bg-gray-200  h-full rounded-full" //Seek-bar
							></div>
						</div>
					</div>
				</div>
				<div className="h-full w-1/5 select-none -mt-[1px] items-center justify-evenly   flex flex-col">
					<div
						id="speakerIcon" //Mute-Unmute Button
						className="h-1/3 text-[#9393934C] flex duration-300 items-center "
						onClick={() => {
							if (clickToUnmute.style.height != "0px") return;
							music.muted = !music.muted;
						}}>
						{svg.unmuteIcon}
						<div
							id="slashLine"
							className="h-[110%] bg-bact duration-300 rounded-sm aspect-[1/10] rotate-45 -ml-[50%]"></div>
					</div>
					<div
						id="musicDuration"
						onLoad={startRepeater()}
						className="w-full flex items-center justify-center text-center h-1/3" //Music Duration in mm:ss
					>
						00:00
					</div>
				</div>
			</div>
		</>
	);
}

export default MusicPlayer;
