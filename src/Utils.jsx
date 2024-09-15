export let backgroundImage = document.getElementById("backgroundImage");
export let music = new Audio();
let pSliderPathCache = { points: [], path: [] };
let bSliderPathCache = { points: [], path: [] };
let css=0;
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
	while (str[0] == "'" || str[0] == '"')
		str = str.slice(1);
	while (
		str[str.length - 1] == "'" ||
		str[str.length - 1] == '"'
	)
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
	imp.backgroundImage = lines[
		lines.findIndex((line) => line.includes("[Events]")) + 2
	]
		.split(",")[2]
		.slice(1, -1)
		.trim();
	imp.backgroundImage = cleanse(imp.backgroundImage);
	imp.backgroundImage = assets.filter(
		(x) => x.name == imp.backgroundImage
	)[0].file;
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

export async function setBackground(data) {
	if (backgroundImage.src == "data:image/png;base64," + data) return;

	backgroundImage.style.transitionDuration = "0.3s";
	backgroundImage.style.opacity = 0;

	await new Promise((r) => setTimeout(r, 300));
	backgroundImage.src = "data:image/png;base64," + data;
	backgroundImage.style.transitionDuration = "0s";
	backgroundImage.style.scale = "1.2";

	await new Promise((r) => setTimeout(r, 5));
	backgroundImage.style.transitionDuration = "0.3s";
	backgroundImage.style.scale = "1";

	backgroundImage.style.opacity = 1;
}

export async function setPreviewImage(setID, index) {
	let result = null;
	const request = indexedDB.open("osuStorage", 2);
	request.onsuccess = function (event) {
		//console.log("Success: " + event.type);
		const db = event.target.result;
		db.transaction("Preview").objectStore("Preview").get(setID).onsuccess =
			function (event) {
				if (
					previewImage.src ==
					"data:image/png;base64," + event.target.result.files[index]
				)
					return;
				setBackground(event.target.result.files[index]);
				previewImage.style.opacity = 0;
				setTimeout(() => {
					previewImage.src =
						"data:image/png;base64," +
						event.target.result.files[index];
					previewImage.style.opacity = 1;
				}, 300);
			};
	};
}
export function playSong(setID, index, previewTime) {
	const request = indexedDB.open("osuStorage", 2);
	request.onsuccess = async function (event) {
		while (music.volume >= 0.1) {
			music.volume -= 0.1;
			await new Promise((r) => setTimeout(r, 10));
		}
		music.volume = 0;
		const db = event.target.result;
		db.transaction("Preview").objectStore("Preview").get(setID).onsuccess =
			async function (event) {
				let song = event.target.result.files[index];

				//console.log(metaFiles[clost].audio);
				music.setAttribute("src", "data:audio/ogg;base64," + song);
				music.load();
				music.currentTime = previewTime / 1000;
				music.play();
				while (music.volume <= 0.9) {
					music.volume += 0.1;
					await new Promise((r) => setTimeout(r, 10));
				}
				music.volume = 1;
			};
	};
}
let musicLoaded = false;	
let videoLoaded = false;
export function setMusic(file, setId) {
	console.log(file,setId);
	const request = indexedDB.open("osuStorage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;
		db.transaction("Assets").objectStore("Assets").get(setId).onsuccess =
			function (event) {
				let song = event.target.result.files.find(
					(x) => x.name == file
				);
				music.setAttribute("src", "data:audio/ogg;base64," + song.file);
				music.load();
				music.pause();
				music.currentTime = 0;
				musicLoaded = true;
			};
	};
}
export function setBackgroundVideo(file, setId) {
	const request = indexedDB.open("osuStorage", 2);
	request.onsuccess = function (event) {
		const db = event.target.result;
		db.transaction("Assets").objectStore("Assets").get(setId).onsuccess =
			async function (event) {
				let video = event.target.result.files.find(
					(x) => x.name == file
				);
				console.log(video);
				backgroundVideoSource1.src =
					"data:video/mp4;base64," + video.file;
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
export function fakeClick(index, index2) {
	setTimeout(() => {
		if (index2) {
			scrollMenu.scrollTo({ top: 0.1 * 88 });
		} else scrollMenu.scrollTo({ top: index * 88, behavior: "smooth" });
	}, 20);
}

export let loader = (
	<svg
		width="40px"
		height="40px"
		viewBox="0 0 1024 1024"
		xmlns="http://www.w3.org/2000/svg"
		className=" animate-spin"
		style={{ animationDuration: "2s" }}
		fill="currentColor">
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				fill="currentColor"
				d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path>
		</g>
	</svg>
);

export async function decodeBeatMap(base64, setId) {
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
	setMusic(cleanse(gen["AudioFilename"]), setId);
	let isVideo = false;
	if (events[2].includes("Video")) {
		isVideo = true;
		setBackgroundVideo(cleanse(events[2].split(",")[2]), setId);
	  }
	  else
	  videoLoaded = true;



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
	cs *= 1.2;
	css=cs
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
			obx[3] = [parseInt(obx[3][0])+cs/2, parseInt(obx[3][1])+cs/2];
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
			if(typ=="P")
				obx[3]=pSliderPath(obx[3][0], obx[3][1], obx[3][2])
			else if(typ=="B")
				obx[3]=bSliderPath(obx[3])
			else
				obx[3]=lSliderPath(obx[3])
		} else obx.push([j[0], j[1]]);
		console.log(obx[3]);

		
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
	return [aprate / 1000, cs, hit2, temp, col,isVideo];
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
	start=[start[0]+css,start[1]+css]
	end=[end[0]+css,end[1]+css]
	let path = ["M", start, "A", r, r, 0, laf, saf, end].join(" ");
	pSliderPathCache.points.push(points);
	pSliderPathCache.path.push(path);
	return path;
  }
  
  function dist(a, b) {
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  }
  function lSliderPath(points) {
	let path = "M" + (points[0][0]+css) + " " + (points[0][1]+css);
	for (let i = 1; i < points.length; i++) {
	  path += " L" + (points[i][0]+css) + " " + (points[i][1]+css);
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
	  if (points[i][0] == points[i + 1][0] && points[i][1] == points[i + 1][1]) {
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
		  (subs[i][0][0]+css) +
		  " " +
		  (subs[i][0][1]+css) +
		  " L " +
		  (subs[i][1][0]+css) +
		  " " +
		  (subs[i][1][1]+css) +
		  " ";
	  }
	  if (subs[i].length == 3) {
		path +=
		  " M " +
		  (subs[i][0][0]+css) +
		  " " +
		  (subs[i][0][1]+css) +
		  " Q " +
		  (subs[i][1][0]+css) +
		  " " +
		  (subs[i][1][1]+css) +
		  " " +
		  (subs[i][2][0]+css) +
		  " " +
		  (subs[i][2][1]+css) +
		  " ";
	  }
	  if (subs[i].length == 4) {
		path +=
		  " M " +
		  (subs[i][0][0]+css) +
		  " " +
		  (subs[i][0][1]+css) +
		  " C " +
		  (subs[i][1][0]+css) +
		  " " +
		  (subs[i][1][1]+css) +
		  " " +
		  (subs[i][2][0]+css) +
		  " " +
		  (subs[i][2][1]+css) +
		  " " +
		  (subs[i][3][0]+css) +
		  " " +
		  (subs[i][3][1]+css) +
		  " ";
	  }
	  if (subs[i].length == 5) {
		path +=
		  " M " +
		  (subs[i][0][0]+css) +
		  " " +
		  (subs[i][0][1]+css) +
		  " C " +
		  getControlPoints(subs[i][1], subs[i][2], subs[i][3], 1) +
		  " " +
		  (subs[i][4][0]+css) +
		  " " +
		  (subs[i][4][1]+css) +
		  " ";
	  }
	  if(subs[i].length>5){
	  let points2 = getStrutPoints(subs[i]);
	  path+=" M " + (points2[0][0] +css) + " " + (points2[0][1] +css) + " L ";
	  for (let i = 1; i < points2.length; i++) {
		path += " " + (points2[i][0] +css) + " " + (points2[i][1] +css);+" "
	  }}
  
  
	}
	bSliderPathCache.points.push(points.join(","));
	bSliderPathCache.path.push(path);
  
	return path;
  }
  function getStrutPoints(points) {
		
	  
	// run de Casteljau's algorithm, starting with the base points
	let len= points.length
	let finals=[]
	for (let t=0;t<=1;t+=0.001){
	  for (let i = 0; i < len - 1; i++) {
		for (let j = 0; j < len - 1 - i; j++) {
		  points[j] = [
			points[j][0] + t * (points[j + 1][0] - points[j][0]),
			points[j][1] + t * (points[j + 1][1] - points[j][1]),
		  ];
		}
	  }
	  finals.push(points[0])
	}
	return(finals)
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
	let ret = [p1x+css, p1y+css, p2x+css, p2y+css].join(" ");
	return ret;
  }