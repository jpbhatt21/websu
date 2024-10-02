export let backgroundImage = document.getElementById("backgroundImage");
export let loadingBar = 0;
export function setLoadingBar(x) {
	loadingBar += x;
	try {
		loadBar.style.width = loadingBar + "%";
		if (loadingBar >= 100) {
			setTimeout(() => {
				cts.style.opacity = 1;
				loadBar.parentElement.style.opacity = 0;
			}, 300);
		}
	} catch (e) {}
}
export let music = null;
export function initializeMusic() {
	music = new Audio();
	music.src = "/audio.mp3";
	music.load();
	music.title = "Triangles";
	music.pause();
	setSettings(settings)
}
export async  function reInitializeMusic(){
	await de2()
	music.src=null
	music.srcObj=null
	music.pause()
	music = new Audio();
	setSettings(settings)

}
backgroundImage.src = "/original_1.jpg";
backgroundImage.style.opacity = 0;
setTimeout(() => {
	backgroundImage.style.opacity = 1;
}, 300);
let de2 = async () => {
	while (music.volume >= 0.1) {
		music.volume -= 0.05;
		await new Promise((r) => setTimeout(r, 10));
	}
	music.volume = 0;
	return false;
};
import { Shader, Texture } from "pixi.js";
import { bSliderPath, lSliderPath, pSliderPath, setCs } from "./Sliders";
import { setSettings, settings } from "../SettingsValues";
import { useEffect, useState } from "react";
let musicLoaded = false;
let videoLoaded = false;
export const vertexSrc = `

    precision mediump float;
    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;
    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;
    varying vec2 vUvs;
    void main() {

        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;

export const fragmentSrc = `

    precision mediump float;
    varying vec2 vUvs;
    uniform sampler2D uSampler2;
    uniform float time;
	`;
export let sliderTexture = "/s2d.png";
export const uniforms = {
	uSampler2: Texture.from(sliderTexture),
	time: 0,
};
export const uniforms2 = {
	uSampler2: Texture.from("/nocap.png"),
	time: 0,
};
export let shader = [];
export let capShader = [];
for (let i = 0; i < 101; i++) {
	let alpha = (i / 100).toFixed(2);
	let temp =
		`
	void main() {
       vec4 fg = texture2D(uSampler2, vUvs ) ;
	   fg.ra *= ` +
		alpha +
		`;
	   fg.ga *= ` +
		alpha +
		`;
	   fg.ba *= ` +
		alpha +
		`;
		gl_FragColor = fg;
    }`;
	let s = Shader.from(vertexSrc, fragmentSrc + temp, uniforms);
	shader.push(s);
	s = Shader.from(vertexSrc, fragmentSrc + temp, uniforms2);
	capShader.push(s);
}
export let colors = {
	dark: {
		100: "#4C566A",
		200: "#434C5E",
		300: "#3B4252",
		400: "#2E3440",
	},
	light: {
		100: "#ECEFF4",
		200: "#E5E9F0",
		300: "#D8DEE9",
	},
	blue: {
		100: "#5E81AC",
		200: "#81A1C1",
		300: "#88C0D0",
		400: "#8FBCBB",
	},
	colors: {
		red: "#BF616A",
		orange: "#D08770",
		yellow: "#EBCB8B",
		green: "#A3BE8C",
		purple: "#B48EAD",
	},
	blank: "#1b1b1b",
	post: "#252525",
	bcol: "#939393",
	bhov: "#a3a3a3",
	bact: "#b3b3b3",
};
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
		lines[bgImgLine].includes(".mp4") ||
		lines[bgImgLine].includes(".mov") ||
		lines[bgImgLine].includes(".avi")
	)
		bgImgLine++;

	imp.backgroundImage = lines[bgImgLine].split(",")[2].slice(1, -1).trim();

	imp.backgroundImage = cleanse(imp.backgroundImage);
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
	try {
		imp.audioFile = assets.find((x) =>
			x.name.includes(
				lines
					.filter((x) => x.includes("AudioFilename:"))[0]
					.split(":")[1]
					.trim()
			)
		).file;
	} catch (e) {
		let maxIndex = 0;
		let maxScore = 0;
		assets.map((x, i) => {
			let y = similarity(
				x.name,
				lines
					.filter((x) => x.includes("AudioFilename:"))[0]
					.split(":")[1]
					.trim()
			);
			if (y > maxScore) {
				maxIndex = i;
				maxScore = y;
			}
		});
		imp.audioFile = assets[maxIndex].file;
	}
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
export async function setBackground(data, mode = false) {
	if (backgroundImage.src == "data:image/png;base64," + data) return;
	if (
		(mode && backgroundImage.src == data) ||
		backgroundImage.src == window.location.origin + data
	)
		return;
	if (true) {
		backgroundImage.style.transitionDuration = "0.3s";
		backgroundImage.style.opacity = 0;

		await new Promise((r) => setTimeout(r, 300));
	}
	if (mode) {
		backgroundImage.src = "/original_1.jpg";
		backgroundImage.src = data;
	} else backgroundImage.src = "data:image/png;base64," + data;
	if (true) {
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
	// if (!settingsVal.showPreviewImage && !settingsVal.showBackground) return;

	if (mode) {
		if (index == "") console.log("blank");
		if (
			previewImage.src == index ||
			previewImage.src == window.location.origin + index
		)
			return;
		// if (settingsVal.showBackground)
		setBackground(index, mode);
		// if (!settingsVal.showPreviewImage) return;
		if (true) {
			previewImage.style.opacity = 0;
			await new Promise((r) => setTimeout(r, 300));
		}

		previewImage.src = "/original_1.jpg";
		previewImage.src = index;
		previewImage.style.opacity = 1;

		return;
	}
	const request = indexedDB.open("websuStorage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;
		db.transaction("Preview").objectStore("Preview").get(setID).onsuccess =
			async function (event) {
				if (
					previewImage.src ==
					"data:image/png;base64," + event.target.result.files[index]
				)
					return;
				// if (settingsVal.showBackground)
				setBackground(event.target.result.files[index], mode);
				// if (!settingsVal.showPreviewImage) return;
				if (true) {
					previewImage.style.opacity = 0;
					await new Promise((r) => setTimeout(r, 300));
				}

				previewImage.src =
					"data:image/png;base64," + event.target.result.files[index];
				previewImage.style.opacity = 1;
			};
	};
}
let getWindowDimensions = () => {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
};
export function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowDimensions;
}
export async function playSong(setID, index, previewTime, title, mode = false) {
	
	if (mode) {
		if (setID != "") {
			fetchingSong.style.height = "3.5svh";
			fetchingSong.style.opacity = "1";
		}
		let song = setID;
		if (music.src == song) return true;
		if(await de2())
			return;
		setTimeout(async () => {
			
			music.setAttribute("src", song);
			music.title = title;
			music.load();
			music.play();
			fetchingSong.style.height = "";
			fetchingSong.style.opacity = "";
			let maxVolume =
				((settings.Audio["Master Volume"].value / 100) *
					settings.Audio["Music Volume"].value) /
				100;
			while (music.volume < maxVolume && music.volume < 0.95) {
				music.volume += 0.05;
				await new Promise((r) => setTimeout(r, 10));
			}
			music.volume = Math.min(maxVolume, 1);
		}, 200);
		return;
	}
	
	const request = indexedDB.open("websuStorage", 2);
	request.onsuccess = async function (event) {
		const db = event.target.result;

		db.transaction("Preview").objectStore("Preview").get(setID).onsuccess =
			async function (event) {
				let song = event.target.result.files[index];
				
				if (music.src.length > 0) {
					if (music.src == "data:audio/wav;base64," + song) return true;
					if(await de2())
						return;}
				setTimeout(async () => {
					music.setAttribute("src", "data:audio/wav;base64," + song);
					music.title = title;
					music.load();
					music.currentTime = previewTime / 1000;
					music.play();
					let maxVolume =
						((settings.Audio["Master Volume"].value / 100) *
							settings.Audio["Music Volume"].value) /
						100;
					while (music.volume < maxVolume && music.volume < 0.95) {
						music.volume += 0.05;
						await new Promise((r) => setTimeout(r, 10));
					}
					music.volume = Math.min(maxVolume, 1);
				}, 200);
			};
	};
}
export function setMusic(file, setId, mode) {
	let pre = "websu";
	if (mode) pre = "tempWebsu";
	const request = indexedDB.open(pre + "Storage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;

		db.transaction("Assets").objectStore("Assets").get(setId).onsuccess =
			function (event) {
				let song = event.target.result.files.find(
					(x) => x.name == file
				);
				if (song == undefined) {
					let maxIndex = 0;
					let maxScore = 0;
					event.target.result.files.map((x, i) => {
						let y = similarity(x.name, file);
						if (y > maxScore) {
							maxIndex = i;
							maxScore = y;
						}
					});

					song = event.target.result.files[maxIndex];
				}
				music.setAttribute("src", "data:audio/wav;base64," + song.file);
				music.load();
				music.pause();
				music.currentTime = 0;
				musicLoaded = true;
			};
	};
}
export function setBackgroundVideo(file, setId, mode) {
	let pre = "websu";
	if (mode) pre = "tempWebsu";
	const request = indexedDB.open(pre + "Storage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;

		db.transaction("Assets").objectStore("Assets").get(setId).onsuccess =
			async function (event) {
				let video = event.target.result.files.find(
					(x) => x.name == file
				);
				if (video == undefined) {
					let maxIndex = 0;
					let maxScore = 0;
					event.target.result.files.map((x, i) => {
						let y = similarity(x.name, file);
						if (y > maxScore) {
							maxIndex = i;
							maxScore = y;
						}
					});

					video = event.target.result.files[maxIndex];
				}
				backgroundVideoSource1.src =
					"data:video/avi;base64," + video.file;
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
export function setBackgroundImage(file, setId, mode) {
	let pre = "websu";
	if (mode) pre = "tempWebsu";
	const request = indexedDB.open(pre + "Storage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;

		db.transaction("Assets").objectStore("Assets").get(setId).onsuccess =
			async function (event) {
				let img = event.target.result.files.find((x) => x.name == file);
				if (img == undefined) {
					let maxIndex = 0;
					let maxScore = 0;
					event.target.result.files.map((x, i) => {
						let y = similarity(x.name, file);
						if (y > maxScore) {
							maxIndex = i;
							maxScore = y;
						}
					});

					img = event.target.result.files[maxIndex];
				}
				setBackground(img.file, false);
				videoLoaded = true;
			};
	};
}
export function fakeClick(index, index2, mode = false) {
	setTimeout(() => {
		let scale = settings.User_Interface.UI_Scale.value;
		if (scale == 0) {
			scale = window.innerHeight / 942;
		} else {
			scale = settings.User_Interface.UI_Scale.options[scale];
		}
		if (index2) {
			scrollMenu.scrollTo({ top: 1 * 40 * scale, behavior: "instant" });
		} else {
			scrollMenu.scrollTo({
				top: (index + 0.5) * 80 * scale,
				behavior: "smooth",
			});
		}
	}, 20);
}
export function pause() {
	music.pause();
	backgroundVideo.pause();
}
export function play() {
	music.play();
	backgroundVideo.play();
}
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
	let bgImgLine = osuFile.findIndex((line) => line.includes("[Events]")) + 2;
	let offset = 0;
	if (
		osuFile[bgImgLine].includes("Video") ||
		osuFile[bgImgLine].split(",").length < 5
	)
		offset++;
	let bg = osuFile[bgImgLine + offset].split(",")[2].slice(1, -1).trim();

	bg = cleanse(bg);
	let isVideo = false;
	if (
		events[2 - offset].includes("Video") &&
		settings.Gameplay["Play Video"].value
	) {
		isVideo = true;
		let name = cleanse(events[2 - offset].split(",")[2]);
		if (name.includes(".avi")) {
			isVideo = false;
		} else setBackgroundVideo(name, setId, online);
	}
	if (!isVideo) {
		setBackgroundImage(bg, setId, online);
	}

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
	setCs(cs);

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
	let l = 0;
	let p = 0;
	let b = 0;
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
			obx[3] = [parseInt(obx[3][0]), parseInt(obx[3][1])];
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
			if (typ == "P") {
				obx[3] = pSliderPath(obx[3], parseFloat(j[7]));
			} else if (typ == "B") {
				obx[3] = bSliderPath(obx[3]);
			} else {
				obx[3] = lSliderPath(obx[3]);
			}
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
export function setBeatmapPreviewData(data) {
	previewCircleSize.style.width = data.circleSize * 10 + "%";
	previewApproachRate.style.width = data.approachRate * 10 + "%";
	previewHPDrain.style.width = data.hpDrainRate * 10 + "%";
	previewAccuracy.style.width = data.difficulty * 10 + "%";
	previewMapper.innerHTML = data.creator;
	previewSource.innerHTML = data.source;
	previewVersion.innerHTML = data.level;
	previewTags.innerHTML = data.tags;
	previewSong.innerHTML = data.title;
	previewArtist.innerHTML = data.artist;
	previewVersion2.innerHTML = data.level;
}
