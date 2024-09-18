export let backgroundImage = document.getElementById("backgroundImage");
export let music = new Audio();
import utf8 from "utf8";
import { settingsVal } from "./SettingsVal";
let pSliderPathCache = { points: [], path: [] };
let bSliderPathCache = { points: [], path: [] };
let css = 0;
export function getBeatMapCollectionInfo(file) {
	file = window.atob(file.file);
	let lines = file.split("\n");
	let imp = {};

	imp.title = lines
		.filter((x) => x.includes("Title:"))[0]
		.split(":")[1]
		.trim();
	imp.artist = lines
		.filter((x) => x.includes("Artist:"))[0]
		.split(":")[1]
		.trim();
	imp.creator = lines
		.filter((x) => x.includes("Creator:"))[0]
		.split(":")[1]
		.trim();
	imp.source = lines
		.filter((x) => x.includes("Source:"))[0]
		.split(":")[1]
		.trim();
	imp.tags = lines
		.filter((x) => x.includes("Tags:"))[0]
		.split(":")[1]
		.trim();
	imp.setId = parseInt(
		lines
			.filter((x) => x.includes("BeatmapSetID:"))[0]
			.split(":")[1]
			.trim()
	);

	return imp;
}
export function cleanse(str) {
	str = str.trim();
	while (str[0] == "'" || str[0] == '"') str = str.slice(1);
	while (str[str.length - 1] == "'" || str[str.length - 1] == '"')
		str = str.slice(0, -1);
	return str.trim();
}
export function getIndividualBeatMapInfo(file2, assets) {
	let file = window.atob(file2);
	let lines = file.split("\n");
	let imp = {};
	imp.difficulty = parseFloat(
		lines
			.filter((x) => x.includes("OverallDifficulty:"))[0]
			.split(":")[1]
			.trim()
	);
	imp.level = lines
		.filter((x) => x.includes("Version:"))[0]
		.split(":")[1]
		.trim();
	imp.circleSize = parseFloat(
		lines
			.filter((x) => x.includes("CircleSize:"))[0]
			.split(":")[1]
			.trim()
	);
	imp.approachRate = parseFloat(
		lines
			.filter((x) => x.includes("ApproachRate:"))[0]
			.split(":")[1]
			.trim()
	);
	imp.hpDrainRate = parseFloat(
		lines
			.filter((x) => x.includes("HPDrainRate:"))[0]
			.split(":")[1]
			.trim()
	);
	imp.mapper = lines
		.filter((x) => x.includes("Creator:"))[0]
		.split(":")[1]
		.trim();
	imp.source = lines
		.filter((x) => x.includes("Source:"))[0]
		.split(":")[1]
		.trim();
	imp.tags = lines
		.filter((x) => x.includes("Tags:"))[0]
		.split(":")[1]
		.trim();
	let bgImgLine = lines.findIndex((line) => line.includes("[Events]")) + 2;
	if (
		lines[bgImgLine].includes("Video") ||
		lines[bgImgLine].split(",").length < 5
	)
		bgImgLine++;
	imp.backgroundImage = lines[bgImgLine].split(",")[2].slice(1, -1).trim();

	imp.backgroundImage = cleanse(imp.backgroundImage);
	//console.log(assets);
	try {
		imp.backgroundImage = assets.filter(
			(x) => cleanse(x.name) == imp.backgroundImage
		)[0].file;
	} catch (e) {
		let maxIndex = 0;
		let maxScore = 0;
		assets.map((x, i) => {
			let y = similarity(x.name, imp.backgroundImage);
			if (y > maxScore) {
				maxIndex = i;
				maxScore = y;
			}
		});
		imp.backgroundImage = assets[maxIndex].file;
	}
	imp.audioFile = assets.find((x) =>
		x.name.includes(
			lines
				.filter((x) => x.includes("AudioFilename:"))[0]
				.split(":")[1]
				.trim()
		)
	).file;
	imp.audioLeadIn = parseFloat(
		lines
			.filter((x) => x.includes("AudioLeadIn:"))[0]
			.split(":")[1]
			.trim()
	);
	imp.previewTime = parseFloat(
		lines

			.filter((x) => x.includes("PreviewTime:"))[0]
			.split(":")[1]
			.trim()
	);
	imp.id = parseInt(
		lines
			.filter((x) => x.includes("BeatmapID:"))[0]
			.split(":")[1]
			.trim()
	);
	imp.setId = parseInt(
		lines
			.filter((x) => x.includes("BeatmapSetID:"))[0]
			.split(":")[1]
			.trim()
	);
	imp.file = file2;
	return imp;
}
function testing(s1, s2) {
	//console.log(similarity(s1, s2));
	return false;
}
function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (
		(longerLength - editDistance(longer, shorter)) /
		parseFloat(longerLength)
	);
}
function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue =
							Math.min(Math.min(newValue, lastValue), costs[j]) +
							1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}
//console.log(utf8.decode("?vtelen.png\u0000"));
export async function setBackground(data, mode = false) {
	//console.log("in");
	if (backgroundImage.src == "data:image/png;base64," + data) return;
	if (mode && backgroundImage.src == data) return;
	if (settingsVal.animateBackground) {
		backgroundImage.style.transitionDuration = "0.3s";
		backgroundImage.style.opacity = 0;

		await new Promise((r) => setTimeout(r, 300));
	}
	if (mode) backgroundImage.src = data;
	else backgroundImage.src = "data:image/png;base64," + data;
	if (settingsVal.animateBackground) {
		backgroundImage.style.transitionDuration = "0s";
		backgroundImage.style.scale = "1.2";

		await new Promise((r) => setTimeout(r, 5));
		backgroundImage.style.transitionDuration = "0.3s";
	}
	backgroundImage.style.scale = "1";

	backgroundImage.style.opacity = 1;
}

export async function setPreviewImage(
	setID,
	index,
	secondaryIndex,
	mode = false
) {
	let result = null;
	if(!settingsVal.showPreviewImage && !settingsVal.showBackground)
		return
	 
	if (mode) {
		if (previewImage.src == index) return;
		if (secondaryIndex == 0 && !settingsVal.showBackground) setBackground(index, mode);
		if(!settingsVal.showPreviewImage)
			return
		if (settingsVal.animateBackground) {
			previewImage.style.opacity = 0;
			await new Promise((r) => setTimeout(r, 300));
		}

		previewImage.src = index;
		previewImage.style.opacity = 1;

		return;
	}
	const request = indexedDB.open("osuStorage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;
		db.transaction("Preview").objectStore("Preview").get(setID).onsuccess =
			async function (event) {
				if (
					previewImage.src ==
					"data:image/png;base64," + event.target.result.files[index]
				)
					return;
				if(settingsVal.showBackground)
				setBackground(event.target.result.files[index], mode);
				if(!settingsVal.showPreviewImage)
					return
				if (settingsVal.animateBackground) {
					previewImage.style.opacity = 0;
					await new Promise((r) => setTimeout(r, 300));
				}

				previewImage.src =
					"data:image/png;base64," + event.target.result.files[index];
				previewImage.style.opacity = 1;
			};
	};
}
export async function playSong(setID, index, previewTime, title, mode = false) {
	let de2 = async (song) => {
		if (music.src == song) return;
		while (music.volume >= 0.1) {
			music.volume -= 0.05;
			await new Promise((r) => setTimeout(r, 10));
		}
		music.volume = 0;
	};
	if (mode) {
		if (setID != "") {
			fetchingSong.style.height = "3.5svh";
			fetchingSong.style.opacity = "1";
		}

		let song = setID;
		de2(song);
		setTimeout(async () => {
			music.setAttribute("src", song);
			music.title = title;
			music.load();
			music.play();
			fetchingSong.style.height = "";
			fetchingSong.style.opacity = "";
			while (music.volume <= 0.9) {
				music.volume += 0.05;
				await new Promise((r) => setTimeout(r, 10));
			}
			music.volume = 1;
		}, 200);
		return;
	}
	let diver = async (song) => {
		if (music.src == "data:audio/wav;base64," + song) return;
		while (music.volume >= 0.1) {
			music.volume -= 0.05;
			await new Promise((r) => setTimeout(r, 10));
		}
		music.volume = 0;
		return;
	};
	const request = indexedDB.open("osuStorage", 2);
	request.onsuccess = async function (event) {
		const db = event.target.result;

		db.transaction("Preview").objectStore("Preview").get(setID).onsuccess =
			async function (event) {
				let song = event.target.result.files[index];
				if (music.src.length > 0) diver(song);

				setTimeout(async () => {
					music.setAttribute("src", "data:audio/wav;base64," + song);
					music.title = title;
					music.load();
					music.currentTime = previewTime / 1000;
					music.play();
					while (music.volume <= 0.9) {
						music.volume += 0.05;
						await new Promise((r) => setTimeout(r, 10));
					}
					music.volume = 1;
				}, 200);
			};
	};
}
let musicLoaded = false;
let videoLoaded = false;
export function setMusic(file, setId, mode) {
	const request = indexedDB.open("osuStorage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;
		let pre = "";
		if (mode) pre = "Temp";
		db
			.transaction(pre + "Assets")
			.objectStore(pre + "Assets")
			.get(setId).onsuccess = function (event) {
			let song = event.target.result.files.find((x) => x.name == file);
			music.setAttribute("src", "data:audio/wav;base64," + song.file);
			music.load();
			music.pause();
			music.currentTime = 0;
			musicLoaded = true;
		};
	};
}
export function setBackgroundVideo(file, setId, mode) {
	const request = indexedDB.open("osuStorage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;
		let pre = "";
		if (mode) pre = "Temp";
		db
			.transaction(pre + "Assets")
			.objectStore(pre + "Assets")
			.get(setId).onsuccess = async function (event) {
			let video = event.target.result.files.find((x) => x.name == file);
			backgroundVideoSource1.src = "data:video/avi;base64," + video.file;
			backgroundVideo.load();
			backgroundVideo.play();

			backgroundVideo.pause();
			backgroundVideo.currentTime = 0;

			backgroundImage.style.opacity = 0;
			await new Promise((r) => setTimeout(r, 300));
			backgroundImage.style.display = "none";
			videoLoaded = true;
		};
	};
}
export function fakeClick(index, index2, mode = false) {
	setTimeout(() => {
		if (index2) {
			if (mode) {
				scrollMenu2.scrollTo({ top: 0.1 * 88 });
				return;
			}
			scrollMenu.scrollTo({ top: 0.1 * 88 });
		} else if (mode) {
			scrollMenu2.scrollTo({ top: index * 88, behavior: "smooth" });
		} else {
			scrollMenu.scrollTo({ top: index * 88, behavior: "smooth" });
		}
	}, 20);
}
export let donwloadIcon = (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<g id="Interface / Download">
				<path
					id="Vector"
					d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"></path>
			</g>
		</g>
	</svg>
);
export let unmuteIcon = (
	<svg
		className="scale-[150%] h-full"
		viewBox="0 0 24 24"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		stroke="currentColor">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M15 16.5858V7.41421C15 6.52331 13.9229 6.07714 13.2929 6.70711L11.2929 8.70711C11.1054 8.89464 10.851 9 10.5858 9H9C8.44772 9 8 9.44772 8 10V14C8 14.5523 8.44772 15 9 15H10.5858C10.851 15 11.1054 15.1054 11.2929 15.2929L13.2929 17.2929C13.9229 17.9229 15 17.4767 15 16.5858Z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"></path>
		</g>
	</svg>
);
export let crossIcon = (
	<svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
				fill="currentColor"></path>
		</g>
	</svg>
);

export let deleteIcon = (
	<svg
		className=" scale-75"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M10 12V17"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"></path>
			<path
				d="M14 12V17"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"></path>
			<path
				d="M4 7H20"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"></path>
			<path
				d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"></path>
			<path
				d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"></path>
		</g>
	</svg>
);
export let loader = (
	<svg
		height="40"
		className="spin"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M12 21C10.5316 20.9987 9.08574 20.6382 7.78865 19.9498C6.49156 19.2614 5.38261 18.2661 4.55853 17.0507C3.73446 15.8353 3.22029 14.4368 3.06088 12.977C2.90147 11.5172 3.10167 10.0407 3.644 8.67604C4.18634 7.31142 5.05434 6.10024 6.17229 5.14813C7.29024 4.19603 8.62417 3.53194 10.0577 3.21378C11.4913 2.89563 12.9809 2.93307 14.3967 3.32286C15.8124 3.71264 17.1113 4.44292 18.18 5.45C18.3205 5.59062 18.3993 5.78125 18.3993 5.98C18.3993 6.17875 18.3205 6.36937 18.18 6.51C18.1111 6.58075 18.0286 6.63699 17.9376 6.67539C17.8466 6.71378 17.7488 6.73357 17.65 6.73357C17.5512 6.73357 17.4534 6.71378 17.3624 6.67539C17.2714 6.63699 17.189 6.58075 17.12 6.51C15.8591 5.33065 14.2303 4.62177 12.508 4.5027C10.7856 4.38362 9.07478 4.86163 7.66357 5.85624C6.25237 6.85085 5.22695 8.30132 4.75995 9.96345C4.29296 11.6256 4.41292 13.3979 5.09962 14.9819C5.78633 16.5659 6.99785 17.865 8.53021 18.6604C10.0626 19.4558 11.8222 19.6989 13.5128 19.3488C15.2034 18.9987 16.7218 18.0768 17.8123 16.7383C18.9028 15.3998 19.4988 13.7265 19.5 12C19.5 11.8011 19.579 11.6103 19.7197 11.4697C19.8603 11.329 20.0511 11.25 20.25 11.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21Z"
				fill="currentColor"></path>
		</g>
	</svg>
);
export let loader2 = (
	<svg
		className="spin h-full"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M12 21C10.5316 20.9987 9.08574 20.6382 7.78865 19.9498C6.49156 19.2614 5.38261 18.2661 4.55853 17.0507C3.73446 15.8353 3.22029 14.4368 3.06088 12.977C2.90147 11.5172 3.10167 10.0407 3.644 8.67604C4.18634 7.31142 5.05434 6.10024 6.17229 5.14813C7.29024 4.19603 8.62417 3.53194 10.0577 3.21378C11.4913 2.89563 12.9809 2.93307 14.3967 3.32286C15.8124 3.71264 17.1113 4.44292 18.18 5.45C18.3205 5.59062 18.3993 5.78125 18.3993 5.98C18.3993 6.17875 18.3205 6.36937 18.18 6.51C18.1111 6.58075 18.0286 6.63699 17.9376 6.67539C17.8466 6.71378 17.7488 6.73357 17.65 6.73357C17.5512 6.73357 17.4534 6.71378 17.3624 6.67539C17.2714 6.63699 17.189 6.58075 17.12 6.51C15.8591 5.33065 14.2303 4.62177 12.508 4.5027C10.7856 4.38362 9.07478 4.86163 7.66357 5.85624C6.25237 6.85085 5.22695 8.30132 4.75995 9.96345C4.29296 11.6256 4.41292 13.3979 5.09962 14.9819C5.78633 16.5659 6.99785 17.865 8.53021 18.6604C10.0626 19.4558 11.8222 19.6989 13.5128 19.3488C15.2034 18.9987 16.7218 18.0768 17.8123 16.7383C18.9028 15.3998 19.4988 13.7265 19.5 12C19.5 11.8011 19.579 11.6103 19.7197 11.4697C19.8603 11.329 20.0511 11.25 20.25 11.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21Z"
				fill="currentColor"></path>
		</g>
	</svg>
);
export let exit = (
	<svg
		className="scale-50"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M14 7.63636L14 4.5C14 4.22386 13.7761 4 13.5 4L4.5 4C4.22386 4 4 4.22386 4 4.5L4 19.5C4 19.7761 4.22386 20 4.5 20L13.5 20C13.7761 20 14 19.7761 14 19.5L14 16.3636"
				stroke="#b3b3b3"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"></path>
			<path
				d="M10 12L21 12M21 12L18.0004 8.5M21 12L18 15.5"
				stroke="#b3b3b3"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"></path>
		</g>
	</svg>
);
export let replay = (
	<svg
		className="scale-50"
		viewBox="0 0 16 16"
		xmlns="http://www.w3.org/2000/svg"
		fill="none">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				fill="#b3b3b3"
				d="M7.248 1.307A.75.75 0 118.252.193l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 01-1.004-1.114l1.29-1.161a4.5 4.5 0 103.655 2.832.75.75 0 111.398-.546A6 6 0 118.018 2l-.77-.693z"></path>
		</g>
	</svg>
);
export let pauseButton = (
	<svg
		className="h-full"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<rect width="24" height="24" fill="transparent"></rect>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20 5L20 19C20 20.6569 18.6569 22 17 22L16 22C14.3431 22 13 20.6569 13 19L13 5C13 3.34314 14.3431 2 16 2L17 2C18.6569 2 20 3.34315 20 5Z"
				fill="currentColor"></path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8 2C9.65685 2 11 3.34315 11 5L11 19C11 20.6569 9.65685 22 8 22L7 22C5.34315 22 4 20.6569 4 19L4 5C4 3.34314 5.34315 2 7 2L8 2Z"
				fill="currentColor"></path>
		</g>
	</svg>
);
export let playButton = (
	<svg
		className="h-full scale-75"
		viewBox="-0.5 0 7 7"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		fill="#000000">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<defs></defs>
			<g
				id="Page-1"
				stroke="none"
				strokeWidth="1"
				fill="none"
				fillRule="evenodd">
				<g
					id="Dribbble-Light-Preview"
					transform="translate(-347.000000, -3766.000000)"
					fill="#b3b3b3">
					<g id="icons" transform="translate(56.000000, 160.000000)">
						<path
							d="M296.494737,3608.57322 L292.500752,3606.14219 C291.83208,3605.73542 291,3606.25002 291,3607.06891 L291,3611.93095 C291,3612.7509 291.83208,3613.26444 292.500752,3612.85767 L296.494737,3610.42771 C297.168421,3610.01774 297.168421,3608.98319 296.494737,3608.57322"
							id="play-[#b3b3b33b3b3]"></path>
					</g>
				</g>
			</g>
		</g>
	</svg>
);
export let playButton2 = (
	<svg
		viewBox="0 0 24 24"
		className="scale-50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.23832 3.04445C5.65196 2.1818 3.75 3.31957 3.75 5.03299L3.75 18.9672C3.75 20.6806 5.65196 21.8184 7.23832 20.9557L20.0503 13.9886C21.6499 13.1188 21.6499 10.8814 20.0503 10.0116L7.23832 3.04445ZM2.25 5.03299C2.25 2.12798 5.41674 0.346438 7.95491 1.72669L20.7669 8.6938C23.411 10.1317 23.411 13.8685 20.7669 15.3064L7.95491 22.2735C5.41674 23.6537 2.25 21.8722 2.25 18.9672L2.25 5.03299Z"
				fill="#b3b3b3"></path>
		</g>
	</svg>
);
export let offlineButton = (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6.24223 4.5H17.7578L19.5 8.85556V18L18.75 18.75H5.25L4.5 18V8.85556L6.24223 4.5ZM7.25777 6L6.35777 8.25H17.6422L16.7422 6H7.25777ZM18 9.75H6V17.25H18V9.75ZM9.59473 13.6553L10.6554 12.5946L11.25 13.1892V11.25H12.75V13.1894L13.3447 12.5946L14.4054 13.6553L12.0001 16.0606L9.59473 13.6553Z"
				fill="currentColor"></path>
		</g>
	</svg>
);
export let onlineButton = (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.83824 18.4467C10.0103 18.7692 10.1826 19.0598 10.3473 19.3173C8.59745 18.9238 7.07906 17.9187 6.02838 16.5383C6.72181 16.1478 7.60995 15.743 8.67766 15.4468C8.98112 16.637 9.40924 17.6423 9.83824 18.4467ZM11.1618 17.7408C10.7891 17.0421 10.4156 16.1695 10.1465 15.1356C10.7258 15.0496 11.3442 15 12.0001 15C12.6559 15 13.2743 15.0496 13.8535 15.1355C13.5844 16.1695 13.2109 17.0421 12.8382 17.7408C12.5394 18.3011 12.2417 18.7484 12 19.0757C11.7583 18.7484 11.4606 18.3011 11.1618 17.7408ZM9.75 12C9.75 12.5841 9.7893 13.1385 9.8586 13.6619C10.5269 13.5594 11.2414 13.5 12.0001 13.5C12.7587 13.5 13.4732 13.5593 14.1414 13.6619C14.2107 13.1384 14.25 12.5841 14.25 12C14.25 11.4159 14.2107 10.8616 14.1414 10.3381C13.4732 10.4406 12.7587 10.5 12.0001 10.5C11.2414 10.5 10.5269 10.4406 9.8586 10.3381C9.7893 10.8615 9.75 11.4159 9.75 12ZM8.38688 10.0288C8.29977 10.6478 8.25 11.3054 8.25 12C8.25 12.6946 8.29977 13.3522 8.38688 13.9712C7.11338 14.3131 6.05882 14.7952 5.24324 15.2591C4.76698 14.2736 4.5 13.168 4.5 12C4.5 10.832 4.76698 9.72644 5.24323 8.74088C6.05872 9.20472 7.1133 9.68686 8.38688 10.0288ZM10.1465 8.86445C10.7258 8.95042 11.3442 9 12.0001 9C12.6559 9 13.2743 8.95043 13.8535 8.86447C13.5844 7.83055 13.2109 6.95793 12.8382 6.2592C12.5394 5.69894 12.2417 5.25156 12 4.92432C11.7583 5.25156 11.4606 5.69894 11.1618 6.25918C10.7891 6.95791 10.4156 7.83053 10.1465 8.86445ZM15.6131 10.0289C15.7002 10.6479 15.75 11.3055 15.75 12C15.75 12.6946 15.7002 13.3521 15.6131 13.9711C16.8866 14.3131 17.9412 14.7952 18.7568 15.2591C19.233 14.2735 19.5 13.1679 19.5 12C19.5 10.8321 19.233 9.72647 18.7568 8.74093C17.9413 9.20477 16.8867 9.6869 15.6131 10.0289ZM17.9716 7.46178C17.2781 7.85231 16.39 8.25705 15.3224 8.55328C15.0189 7.36304 14.5908 6.35769 14.1618 5.55332C13.9897 5.23077 13.8174 4.94025 13.6527 4.6827C15.4026 5.07623 16.921 6.08136 17.9716 7.46178ZM8.67765 8.55325C7.61001 8.25701 6.7219 7.85227 6.02839 7.46173C7.07906 6.08134 8.59745 5.07623 10.3472 4.6827C10.1826 4.94025 10.0103 5.23076 9.83823 5.5533C9.40924 6.35767 8.98112 7.36301 8.67765 8.55325ZM15.3224 15.4467C15.0189 16.637 14.5908 17.6423 14.1618 18.4467C13.9897 18.7692 13.8174 19.0598 13.6527 19.3173C15.4026 18.9238 16.921 17.9186 17.9717 16.5382C17.2782 16.1477 16.3901 15.743 15.3224 15.4467ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
				fill="currentColor"></path>
		</g>
	</svg>
);
export async function decodeBeatMap(base64, setId, online) {
	musicLoaded = false;
	let osuFile = window.atob(base64);
	osuFile = osuFile.split("\n");
	let events = osuFile.slice(
		osuFile.findIndex((line) => line.includes("[Events]")) + 1,
		osuFile.findIndex((line) => line.includes("[TimingPoints]"))
	);
	let gen = osuFile.slice(
		osuFile.findIndex((line) => line.includes("[General]")) + 1,
		osuFile.findIndex((line) => line.includes("[Editor]"))
	);
	gen = gen.map((line) => line.split(": "));
	gen = Object.fromEntries(gen);
	setMusic(cleanse(gen["AudioFilename"]), setId, online);
	let isVideo = false;
	if (events[2].includes("Video")) {
		isVideo = true;
		let name = cleanse(events[2].split(",")[2]);
		if (name.includes(".avi")) {
			isVideo = false;
			videoLoaded = true;
		} else setBackgroundVideo(name, setId, online);
	} else videoLoaded = true;

	let difficulty = osuFile.slice(
		osuFile.findIndex((line) => line.includes("[Difficulty]")) + 1,
		osuFile.findIndex((line) => line.includes("[Events]"))
	);
	difficulty = difficulty.map((line) => line.split(":"));
	difficulty = Object.fromEntries(difficulty);
	let timingPoints = osuFile.slice(
		osuFile.findIndex((line) => line.includes("[TimingPoints]")) + 1,
		osuFile.findIndex((line) => line.includes("[Colours]"))
	);
	timingPoints = timingPoints.map((line) => line.split(","));
	timingPoints = timingPoints.map((line) => line.map((x) => parseFloat(x)));
	let colors = osuFile.slice(
		osuFile.findIndex((line) => line.includes("[Colours]")) + 1,
		osuFile.findIndex((line) => line.includes("[HitObjects]"))
	);
	colors = colors.map((line) => line.split(" : "));
	colors = Object.fromEntries(colors);
	colors = Object.values(colors);
	colors = colors.filter((line) => typeof line == "string");

	let aprate = 1200;
	let aprd = parseInt(difficulty["ApproachRate"]);
	if (aprd < 5) {
		aprate += 120 * (5 - aprd);
	} else {
		aprate -= 150 * (aprd - 5);
	}
	let cs = 54.4 - 4.48 * parseInt(difficulty["CircleSize"]);
	let oldcs = JSON.parse(JSON.stringify(cs));
	cs = (cs * 384) / (384 - cs * 3);
	//console.log(cs / oldcs, (384 + cs * 3) / 384);
	css = cs;
	let hitObjects = osuFile.slice(
		osuFile.findIndex((line) => line.includes("[HitObjects]")) + 1
	);
	hitObjects.pop();
	//hitObjects.unshift("273,8,2163,6,0,B|232:5|232:5|204:27|204:27|163:36,1,107.999996704102,2|4,0:1|1:2,0:2:0:0:")
	hitObjects = hitObjects.map((line) => line.split(","));
	for (let i = 0; i < hitObjects.length; i++) {
		hitObjects[i][0] = parseInt(hitObjects[i][0]);
		hitObjects[i][1] = parseInt(hitObjects[i][1]);
		hitObjects[i][2] = parseInt(hitObjects[i][2]) / 1000;
		hitObjects[i][3] = parseInt(hitObjects[i][3])
			.toString(2)
			.split("")
			.reverse()
			.join("");
	}
	let sm = difficulty.SliderMultiplier;
	let sv = 1;
	let tsv = 1;
	let bl = 0;
	let svh = { time: [], vel: [] };
	for (let i = 0; i < timingPoints.length; i++) {
		if (timingPoints[i][6] == 1) {
			bl = timingPoints[i][1];
			tsv = bl / (sm * 100);
			if (tsv != sv) {
				sv = tsv;
				svh.time.push(timingPoints[i][0]);
				svh.vel.push(sv);
			}
		} else {
			tsv = bl / ((sm * 100 * -100) / timingPoints[i][1]);
			if (tsv != sv) {
				sv = tsv;
				svh.time.push(timingPoints[i][0]);
				svh.vel.push(sv);
			}
		}
	}
	let hit3 = [];
	hit3.push(hitObjects[0]);
	for (let i = 1; i < hitObjects.length; i++) {
		hit3.push(hitObjects[i]);
		if (
			hitObjects[i][0] == hitObjects[i - 1][0] &&
			hitObjects[i][1] == hitObjects[i - 1][1]
		) {
			hit3[i][1] = hit3[i - 1][1] + 5;
			hit3[i][0] = hit3[i - 1][0] + 5;
		}
	}
	hitObjects = hit3;
	let hit2 = [];
	let obx = [];
	let typ = null;
	let slider = null;
	let cntup = 0;
	for (let i = 0; i < hitObjects.length; i++) {
		let j = hitObjects[i];
		obx = [];
		if (j[3][0] == "1") {
			obx.push(0);
		} else if (j[3][1] == "1") {
			obx.push(1);
		} else if (j[3][3] == "1") {
			obx.push(9);
		}
		obx.push(j[2]);
		obx.push(i);
		if (obx[0] == 0) {
			obx.push([j[0], j[1]]);
			obx.push(parseInt(j[4]));
			obx.push(j[5].split(":").map((j5x) => parseInt(j5x)));
			obx[3] = [parseInt(obx[3][0]) + cs, parseInt(obx[3][1]) + cs];
		} else if (obx[0] == 1) {
			typ = j[5][0];
			slider = j[5]
				.slice(2)
				.split("|")
				.map((pnt) =>
					pnt
						.split(":")
						.map((intp, index) =>
							index == 0 ? parseInt(intp) : parseInt(intp)
						)
				);
			slider.unshift([j[0], j[1]]);
			obx.push(slider);
			obx.push(parseInt(j[4]));
			obx.push(parseInt(j[6]));
			if (
				cntup + 1 == svh.time.length ||
				j[2] * 1000 < svh.time[cntup + 1]
			) {
				obx.push((j[7] * svh.vel[cntup]) / 1000);
			} else {
				while (
					j[2] * 1000 > svh.time[cntup + 1] &&
					cntup + 1 < svh.time.length
				) {
					cntup++;
				}
				obx.push((j[7] * svh.vel[cntup]) / 1000);
			}
			try {
				obx.push(j[8].split("|").map((j5x) => parseInt(j5x)));
				obx.push(
					j[9]
						.split("|")
						.map((xyx) =>
							xyx.split(":").map((j5x) => parseInt(j5x))
						)
				);
				obx.push(j[10].split(":").map((j5x) => parseInt(j5x)));
			} catch (e) {}
			obx[0] = typ == "P" ? 2 : typ == "B" ? 3 : 1;
			if (typ == "P")
				obx[3] = pSliderPath(obx[3][0], obx[3][1], obx[3][2]);
			else if (typ == "B") obx[3] = bSliderPath(obx[3]);
			else obx[3] = lSliderPath(obx[3]);
		} else obx.push([j[0], j[1]]);

		hit2.push(obx);
	}
	let temp = [];
	let hitObjectLabel = 1;
	temp = hitObjects.map((x) =>
		x[3][2] == "1" ? (hitObjectLabel = 1) : ++hitObjectLabel
	);
	let col = [];
	let ind = 0;
	for (let i = 0; i < hitObjects.length; i++) {
		if (hitObjects[i][3][2] == "1") {
			ind = (ind + 1) % colors.length;
		}
		col.push(colors[ind]);
	}
	while (!musicLoaded || !videoLoaded) {
		await new Promise((r) => setTimeout(r, 100));
	}
	pSliderPathCache = { points: [], path: [] };
	bSliderPathCache = { points: [], path: [] };

	if (colors.length == 0)
		colors = "163, 190, 140|".repeat(4).split("|").slice(0, 4);
	else if (colors.length == 1)
		colors = (colors[0] + "|").repeat(4).split("|").slice(0, 4);
	else if (colors.length == 2) {
		let avg = colors
			.map((x) => x.split(",").map((x) => parseInt(x)))
			.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]])
			.map((x) => x / 2)
			.map((x) => Math.round(x));
		colors = [colors[0], avg.join(","), colors[1], avg.join(",")];
	} else if (colors.length == 3)
		colors = [colors[0], colors[1], colors[0], colors[2]];
	else colors = colors.slice(0, 4);
	return [aprate / 1000, cs, hit2, temp, col, isVideo, colors];
}

function pSliderPath(start, mid, end) {
	let points = [start, mid, end].join(",");
	if (pSliderPathCache.points.includes(points)) {
		return pSliderPathCache.path[pSliderPathCache.points.indexOf(points)];
	}
	const A = dist(end, mid);
	const B = dist(mid, start);
	const C = dist(start, end);
	const ang = (A * A + B * B - C * C) / (2 * A * B);
	const angle = Math.acos(ang > 1 ? 1 : ang < -1 ? -1 : ang);
	//calc radius of circle
	const K = 0.5 * A * B * Math.sin(angle);
	let r = (A * B * C) / 4 / K;
	r = Math.round(r * 1000) / 1000;

	//large arc flag
	const laf = +(Math.PI / 2 > angle);

	//sweep flag
	const saf = +(
		(end[0] - start[0]) * (mid[1] - start[1]) -
			(end[1] - start[1]) * (mid[0] - start[0]) <
		0
	);
	start = [start[0] + css * 1.5, start[1] + css * 1.5];
	end = [end[0] + css * 1.5, end[1] + css * 1.5];
	let path = ["M", start, "A", r, r, 0, laf, saf, end].join(" ");
	pSliderPathCache.points.push(points);
	pSliderPathCache.path.push(path);
	return path;
}

function dist(a, b) {
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}
function lSliderPath(points) {
	let path =
		"M" + (points[0][0] + css * 1.5) + " " + (points[0][1] + css * 1.5);
	for (let i = 1; i < points.length; i++) {
		path +=
			" L" +
			(points[i][0] + css * 1.5) +
			" " +
			(points[i][1] + css * 1.5);
	}
	return path;
}
function bSliderPath(points, val = true) {
	if (bSliderPathCache.points.includes(points.join(","))) {
		return bSliderPathCache.path[
			bSliderPathCache.points.indexOf(points.join(","))
		];
	}

	let path = " ";
	let subs = [];
	let sub = [];
	sub.push(points[0]);
	for (let i = 1; i < points.length - 1; i++) {
		sub.push(points[i]);
		if (
			points[i][0] == points[i + 1][0] &&
			points[i][1] == points[i + 1][1]
		) {
			subs.push(sub);
			sub = [];
		}
	}
	sub.push(points[points.length - 1]);
	subs.push(sub);
	for (let j = 0; j < subs.length; j++) {
		let i = j;
		if (subs[i].length == 2) {
			path +=
				" M " +
				(subs[i][0][0] + css * 1.5) +
				" " +
				(subs[i][0][1] + css * 1.5) +
				" L " +
				(subs[i][1][0] + css * 1.5) +
				" " +
				(subs[i][1][1] + css * 1.5) +
				" ";
		}
		if (subs[i].length == 3) {
			path +=
				" M " +
				(subs[i][0][0] + css * 1.5) +
				" " +
				(subs[i][0][1] + css * 1.5) +
				" Q " +
				(subs[i][1][0] + css * 1.5) +
				" " +
				(subs[i][1][1] + css * 1.5) +
				" " +
				(subs[i][2][0] + css * 1.5) +
				" " +
				(subs[i][2][1] + css * 1.5) +
				" ";
		}
		if (subs[i].length == 4) {
			path +=
				" M " +
				(subs[i][0][0] + css * 1.5) +
				" " +
				(subs[i][0][1] + css * 1.5) +
				" C " +
				(subs[i][1][0] + css * 1.5) +
				" " +
				(subs[i][1][1] + css * 1.5) +
				" " +
				(subs[i][2][0] + css * 1.5) +
				" " +
				(subs[i][2][1] + css * 1.5) +
				" " +
				(subs[i][3][0] + css * 1.5) +
				" " +
				(subs[i][3][1] + css * 1.5) +
				" ";
		}
		if (subs[i].length == 5) {
			path +=
				" M " +
				(subs[i][0][0] + css * 1.5) +
				" " +
				(subs[i][0][1] + css * 1.5) +
				" C " +
				getControlPoints(subs[i][1], subs[i][2], subs[i][3], 1) +
				" " +
				(subs[i][4][0] + css * 1.5) +
				" " +
				(subs[i][4][1] + css * 1.5) +
				" ";
		}
		if (subs[i].length > 5) {
			let points2 = getStrutPoints(subs[i]);
			path +=
				" M " +
				(points2[0][0] + css * 1.5) +
				" " +
				(points2[0][1] + css * 1.5) +
				" L ";
			for (let i = 1; i < points2.length; i++) {
				path +=
					" " +
					(points2[i][0] + css * 1.5) +
					" " +
					(points2[i][1] + css * 1.5);
				+" ";
			}
		}
	}
	bSliderPathCache.points.push(points.join(","));
	bSliderPathCache.path.push(path);

	return path;
}
function getStrutPoints(points) {
	// run de Casteljau's algorithm, starting with the base points
	let len = points.length;
	let finals = [];
	for (let t = 0; t <= 1; t += 0.001) {
		for (let i = 0; i < len - 1; i++) {
			for (let j = 0; j < len - 1 - i; j++) {
				points[j] = [
					points[j][0] + t * (points[j + 1][0] - points[j][0]),
					points[j][1] + t * (points[j + 1][1] - points[j][1]),
				];
			}
		}
		finals.push(points[0]);
	}
	return finals;
}
function getControlPoints([x0, y0], [x1, y1], [x2, y2], t) {
	var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
	var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	var fa = (t * d01) / (d01 + d12); // scaling factor for triangle Ta
	var fb = (t * d12) / (d01 + d12); // ditto for Tb, simplifies to fb=t-fa
	var p1x = x1 - fa * (x2 - x0); // x2-x0 is the width of triangle T
	var p1y = y1 - fa * (y2 - y0); // y2-y0 is the height of T
	var p2x = x1 + fb * (x2 - x0);
	var p2y = y1 + fb * (y2 - y0);
	let ret = [
		p1x + css * 1.5,
		p1y + css * 1.5,
		p2x + css * 1.5,
		p2y + css * 1.5,
	].join(" ");
	return ret;
}
export function pause(ele) {
	pauseMenu.style.opacity = "1";
	pauseMenu.style.pointerEvents = "all";
	music.pause();
	backgroundVideo.pause();
	let children = ele.children;
	ele.style.animationPlayState = "paused";
	for (let i = 0; i < children.length; i++) {
		pause(children[i]);
	}
}
export function play(ele) {
	let children = ele.children;

	ele.style.animationPlayState = "running";
	for (let i = 0; i < children.length; i++) {
		play(children[i]);
	}
	music.play();
	backgroundVideo.play();
}
