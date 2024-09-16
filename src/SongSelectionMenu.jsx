import JSZip from "jszip";
import Preview from "./Preview";
import { useEffect, useState } from "react";
import MiniSearch from "minisearch";
import utf8 from "utf8";
import {
	fakeClick,
	getBeatMapCollectionInfo,
	getIndividualBeatMapInfo,
	loader,
	playSong,
	setBackground,
	setPreviewImage,
	music,
	backgroundImage,
	pause,
	play,
	exit,
	replay,
	playButton,
	playButton2,
	deleteIcon,
	crossIcon,
	offlineButton,
	onlineButton,
} from "./Utils";
import PlayArea from "./PlayArea";
import { uri } from "./App";
let typetimer = null;
let sctimer = null;
let musicTimer = null;
let minis = null;
let loadTime = null;
let defaultElementClass =
	"bg-blank outline fade-in outline-1 mb-[8px] mr-[10px] ml-[10px] outline-bcol duration-300 w-[45vw] rounded-md text-gray-300 max-h-[50vh] shadow-lg nons snap-cetner overflow-hidden ";
function SongSelectionMenu() {
	function getFiles(files, mode = false) {
		for (let i = 0; i < files.length; i++) {
			try {
				if (files[i].name.includes(".osz")) {
					getOszFileToUnzip(files[i], i, mode);
				} else {
					continue;
					handleNonOszFiles(files[i]);
				}
			} catch (e) {}
		}
	}
	async function getOszFileToUnzip(file, diffe = 0, mode) {
		// let filz = [];
		// let test = allFiles;
		// test.name.push(file.name);
		// test.files.push([]);
		// test.levels.push([]);
		// let l = allFiles.name.length + diffe;
		// document.getElementById(
		// 	"sub" + globalIndex + " " + secondaryIndex
		// ).style.backgroundColor = "";
		// document.getElementById(
		// 	"sub" + globalIndex + " " + 0
		// ).style.backgroundColor = "rgb(148 163 184 / var(--tw-bg-opacity))";
		// setGlobalIndex(-1);
		// setSecondaryIndex(0);
		// let len = 0;
		// let meta = "";
		// let init = 0;
		// let osus = [];
		// let lz = 0;
		let zip = new JSZip();

		let osuFiles = [];
		let assets = [];
		let unzipOsz = zip.loadAsync(file).then(async function (zip) {
			for (let i in zip.files) {
				let loadIndividualFiles = zip
					.file(i)
					.async("base64")
					.then(function (blob) {
						if (i.includes(".osu")) {
							osuFiles.push(blob);
						} else {
							assets.push({ name: i, file: blob });
						}
					});
				await loadIndividualFiles;
			}
		});
		await unzipOsz;
		let beatmapInfo = [];
		let preview = [];

		for (let i in osuFiles) {
			beatmapInfo.push(getIndividualBeatMapInfo(osuFiles[i], assets));

			if (!preview.includes(beatmapInfo[i].audioFile)) {
				preview.push(beatmapInfo[i].audioFile);
				beatmapInfo[i].audioFile = preview.length - 1;
			} else {
				beatmapInfo[i].audioFile = preview.indexOf(
					beatmapInfo[i].audioFile
				);
			}
			if (!preview.includes(beatmapInfo[i].backgroundImage)) {
				preview.push(beatmapInfo[i].backgroundImage);
				beatmapInfo[i].backgroundImage = preview.length - 1;
			} else {
				beatmapInfo[i].backgroundImage = preview.indexOf(
					beatmapInfo[i].backgroundImage
				);
			}

			if (beatmapInfo[0].setId != beatmapInfo[i].setId) {
				return;
			}
		}
		beatmapInfo.sort((a, b) => a.difficulty - b.difficulty);

		let setMeta = getBeatMapCollectionInfo({ file: osuFiles[0] });
		osuFiles = {
			setId: setMeta.setId,
			files: beatmapInfo.map((x) => {
				let temp = JSON.parse(JSON.stringify(x.file));
				x.file = null;
				return { id: x.id, file: temp };
			}),
		};
		setMeta.levels = beatmapInfo;
		setMeta.backgroundImage = preview[beatmapInfo[0].backgroundImage];

		preview = { setId: setMeta.setId, files: preview };
		assets = { setId: setMeta.setId, files: assets };
		const request = indexedDB.open("osuStorage", 2);
		request.onsuccess = function (event) {
			const db = event.target.result;
			const transaction = db.transaction(
				["Assets", "Files", "Meta", "Preview"],
				"readwrite"
			);
			let objectStore = transaction.objectStore("Assets");
			try {
				const request = objectStore.put(assets);
			} catch (e) {
				const request = objectStore.add(assets);
			}
			objectStore = transaction.objectStore("Files");
			try {
				const request = objectStore.put(osuFiles);
			} catch (e) {
				const request = objectStore.add(osuFiles);
			}
			objectStore = transaction.objectStore("Meta");
			try {
				const request = objectStore.put(setMeta);
			} catch (e) {
				const request = objectStore.add(setMeta);
			}
			objectStore = transaction.objectStore("Preview");
			try {
				const request = objectStore.put(preview);
			} catch (e) {
				const request = objectStore.add(preview);
			}
			setMeta.id = metaData.length;
			setMetaData((prev) => [...prev, setMeta]);
			setMetaFiles((prev) => [...prev, setMeta]);
			try {
				minis.add(setMeta);
			} catch (e) {}
			console.log(mode);
			if (mode) return;
			else {
				console.log("here");
				fakeClick(Math.max(metaData.length, 1), false);
				setSearchKey(searchKey + 1);
			}
		};
	}
	async function fetchFromDB(collectionName, setID, object) {
		let result = null;
		const request = indexedDB.open("osuStorage", 2);
		request.onsuccess = function (event) {
			const db = event.target.result;
			db
				.transaction(collectionName)
				.objectStore(collectionName)
				.get(setID).onsuccess = function (event) {
				result = event.target.result;
			};
		};
		while (result == null) {
			await new Promise((r) => setTimeout(r, 10));
		}
		return "ok";
	}
	const [metaData, setMetaData] = useState([]);
	const [webSearchData, setWebSearchData] = useState([]);
	const [metaFiles, setMetaFiles] = useState([]);
	const [scrollIndex, setScrollIndex] = useState([]);
	const [globalIndex, setGlobalIndex] = useState(-1);
	const [secondaryIndex, setSecondaryIndex] = useState(0);
	const [searchKey, setSearchKey] = useState(0);
	const [start, setStart] = useState(false);
	const [focus, setFocus] = useState(!false);
	const [prevMusic, setPrevMusic] = useState([]);
	const [onlineMode, setOnlineMode] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const [deleteMode, setDeleteMode] = useState(false);
	const [inter, setInter] = useState(false);
	let loadLimit = parseInt(window.innerHeight / 88);
	if (loadLimit < 6) loadLimit = 6;
	function getMetaFiles() {
		return metaFiles;
	}
	if (start) {
		backgroundImage.style.filter = "blur(0px) brightness(0.5)";
	} else {
		backgroundImage.style.filter = "blur(12px) brightness(0.5)";
	}
	function keyaction(e) {
		//e.preventDefault();
		if (previewSearch.style.opacity == 1) {
			if (!start && e.key == "Escape") {
				searchbox.value = "";
				searchbox.blur();
				resetButton.click();

				return;
			}
			if (!start) {
				searchbox.focus();
				return;
			}
		} else {
			if (e.repeat) return;

			if (e.key == "Escape") {
				let root = document.querySelector("#playArea");
				if (root.style.animationPlayState != "paused") {
					pause(root);
				} else {
					pauseMenu.style.opacity = "0";

					pauseMenu.style.pointerEvents = "none";
					setTimeout(() => {
						play(root);
					}, 1000);
				}
			}
			if (e.key == "x" || e.key == "z") {
				{
					let doc = document.querySelector(
						"#test23 > div >  div:hover "
					);
					if (doc != null) {
						doc.click();
						doc.style.pointerEvents = "none";
					}
				}
			}
		}
	}
	async function keyaction2(e) {
		if (!inter && music.paused ) {
			try{
				music.currentTime += (new Date().getTime() - loadTime) / 1000 - 1.5;
			music.play();
			music.volume = 0;
			while (music.volume <= 0.9) {
				music.volume += 0.1;
				await new Promise((r) => setTimeout(r, 10));
			}
			music.volume = 1;

			}
			catch(e){
				}
				setInter(true);
		document.removeEventListener("click", keyaction2);
				
			
		}
		
	}

	useEffect(() => {
		if (!focus) return;
		//document.documentElement.requestFullscreen();
		loadTime = new Date().getTime();
		document.addEventListener("keydown", keyaction);
		document.addEventListener("click", keyaction2);
		const request = indexedDB.open("osuStorage", 2);
		request.onupgradeneeded = function (event) {
			const db = event.target.result;
			let objectStore = db.createObjectStore("Files", {
				keyPath: "setId",
			});
			objectStore = db.createObjectStore("Assets", {
				keyPath: "setId",
			});
			objectStore = db.createObjectStore("Meta", {
				keyPath: "setId",
			});
			objectStore = db.createObjectStore("Preview", {
				keyPath: "setId",
			});
			// objectStore.createIndex("name", "name", { unique: true });
			// objectStore.createIndex("files", "files", { unique: false });
			// objectStore.createIndex("meta", "meta", { unique: false });
			// objectStore.createIndex("levels", "levels", { unique: false });
		};
		request.onsuccess = function (event) {
			const db = event.target.result;

			db.transaction("Meta").objectStore("Meta").getAll().onsuccess =
				async function (event) {
					setTimeout(() => {
						let result = event.target.result.sort((a, b) =>
							a.title.localeCompare(b.title)
						);
						result.map((element, index) => {
							element.id = index;
						});
						setMetaData(result);
						setMetaFiles(result);

						minis = new MiniSearch({
							fields: [
								"title",
								"artist",
								"creator",
								"tags",
								"setId",
							],
							storeFields: [
								"title",
								"artist",
								"creator",
								"tags",
								"setId",
							],
							searchOptions: {
								fuzzy: 0.2,
								prefix: true,
							},
						});
						minis.addAll(result);
						fakeClick(0, true);
						setTimeout(() => {
							//setStart(true)
						}, 2000);
					}, 10);
				};
		};
	}, [focus]);
	useEffect(() => {
		if (!start && prevMusic.length > 0) {
			musicTimer = setTimeout(() => {
				playSong(prevMusic[0], prevMusic[1], prevMusic[2]);
			}, 100);
		} else if (musicTimer != null) {
			clearTimeout(musicTimer);
		}
	}, [start]);
	let list = metaData.map((element, index) => {
		return (
			<div
				key={"element" + element.setId}
				id={"element" + index}
				className={defaultElementClass + " bg-opacity-10 h-20 "}>
				{Math.abs(scrollIndex - index) < loadLimit ? (
					<>
						<div
							onClick={() => {
								if (!deleteMode) fakeClick(index, false);
							}}
							className=" w-full h-20  flex   outline outline-1 outline-bcol   rounded-t-lg"
							style={{
								backgroundImage:
									"url(data:image/png;base64," +
									element.backgroundImage +
									")",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}>
							<div className="h-full w-full flex flex-row items-center bg-blank pointer-events-none px-3  justify-between bg-opacity-60">
								<div className="flex  flex-col h-full items-center py-2">
									<div className="flex leading-[40px]  font-semibold text-[30px] pointer-events-none  self-start text-[#ccc] ">
										{element.title}
									</div>
									<div className="flex leading-[20px]   self-start ml-2 text-[#bbb] mb-[20px]  pointer-events-none text-[18px]">
										{element.artist +
											" - " +
											element.creator}
									</div>
								</div>
								<div
									id={"delete" + index}
									className="h-1/2 duration-300 text-bcol hover:text-colors-red aspect-square"
									onClick={(e) => {
										e.preventDefault();
										const request = indexedDB.open(
											"osuStorage",
											2
										);
										request.onsuccess = function (event) {
											const db = event.target.result;
											const transaction = db.transaction(
												[
													"Assets",
													"Files",
													"Meta",
													"Preview",
												],
												"readwrite"
											);
											let objectStore =
												transaction.objectStore(
													"Assets"
												);
											objectStore.delete(element.setId);
											objectStore =
												transaction.objectStore(
													"Files"
												);
											objectStore.delete(element.setId);
											objectStore =
												transaction.objectStore("Meta");
											objectStore.delete(element.setId);
											objectStore =
												transaction.objectStore(
													"Preview"
												);
											objectStore.delete(element.setId);
											let temp = metaData;
											temp = temp.filter(
												(x) => x.setId != element.setId
											);
											let temp2 = metaFiles;
											temp2 = temp2.filter(
												(x) => x.setId != element.setId
											);
											let box = document.getElementById(
												"element" + index
											);
											box.style.marginLeft = "150%";
											box.style.marginBottom = "0px";
											box.style.height = "0px";
											setTimeout(() => {
												setMetaData(temp);
												setMetaFiles(temp2);
											}, 300);
										};
									}}
									style={{
										opacity: deleteMode ? "1" : "0",
										pointerEvents: deleteMode
											? "all"
											: "none",
									}}>
									{crossIcon}
								</div>
							</div>
						</div>

						<div className="p-2 max-h-[calc(50vh-80px)] overflow-y-scroll  pt-3">
							<div
								className="levhol l   w-full p-2 -mt-2  "
								style={{
									height:
										96 +
										element.levels.length * 68 -
										96 +
										"px",
								}}>
								{element.levels.map((x, index2) => (
									<div
										key={"sub" + index + " " + index2}
										id={"sub" + index + " " + index2}
										className=" flex flex-col  justify-evenly rounded-md p-1 px-3 bg-blank bg-opacity-25 duration-300 w-full  text-[#eee] mb-2 h-[60px]"
										onClick={(e) => {
											setSecondaryIndex(index2);
											if (secondaryIndex == index2) {
												setStart(true);
											} else {
												setSecondaryIndex(index2);
												setPreviewImage(
													metaData[index].setId,
													x.backgroundImage,
													index2
												);
												previewCircleSize.style.width =
													x.circleSize * 10 + "%";
												previewApproachRate.style.width =
													x.approachRate * 10 + "%";
												previewHPDrain.style.width =
													x.hpDrainRate * 10 + "%";
												previewAccuracy.style.width =
													x.difficulty * 10 + "%";
												previewMapper.innerHTML =
													x.mapper;
												previewSource.innerHTML =
													utf8.decode(x.source);
												previewVersion2.innerHTML =
													x.level;
												previewTags.innerHTML =
													utf8.decode(x.tags);
												previewSong.innerHTML =
													metaData[index].title;
												previewArtist.innerHTML =
													metaData[index].artist;
												previewVersion.innerHTML =
													x.level;
											}
										}}
										style={{
											backgroundColor:
												secondaryIndex == index2
													? "#94a3b844"
													: "",
										}}>
										<div className=" pointer-events-none leading-[20px]">
											{x.level}
										</div>
										<div className=" pointer-events-none rounded-lg w-full  h-2 bg-white bg-opacity-30 ">
											<div
												className={
													" pointer-events-none rounded-lg h-2"
												}
												style={{
													width:
														x.difficulty * 10 + "%",
													background:
														x.difficulty <= 3.5
															? "#A3BE8C"
															: x.difficulty <= 7
															? "#EBCB8B"
															: x.difficulty <=
															  8.5
															? "#D08770"
															: "#BF616A",
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		);
	});
	let list2 = webSearchData.map((element, index) => {
		return (
			<div
				key={"element" + element.setId}
				id={"element" + index + element.setId}
				className={defaultElementClass + " bg-opacity-10 h-20 "}>
				{true ? (
					<>
						<div
							onClick={() => {
								fakeClick(index, false, true);
							}}
							className=" w-full h-20  flex   outline outline-1 outline-bcol   rounded-t-lg"
							style={{
								backgroundImage:
									"url(" + element.backgroundImage + ")",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}>
							<div className="h-full w-full flex flex-row items-center bg-blank pointer-events-none px-3  justify-between bg-opacity-60">
								<div className="flex  flex-col h-full items-center py-2">
									<div className="flex leading-[40px]  font-semibold text-[30px] pointer-events-none  self-start text-[#ccc] ">
										{element.title}
									</div>
									<div className="flex leading-[20px]   self-start ml-2 text-[#bbb] mb-[20px]  pointer-events-none text-[18px]">
										{element.artist +
											" - " +
											element.creator}
									</div>
								</div>
								<div
									id={"delete" + index}
									className="h-1/2 duration-300 hidden text-bcol hover:text-colors-red aspect-square"
									onClick={(e) => {
										e.preventDefault();
										const request = indexedDB.open(
											"osuStorage",
											2
										);
										request.onsuccess = function (event) {
											const db = event.target.result;
											const transaction = db.transaction(
												[
													"Assets",
													"Files",
													"Meta",
													"Preview",
												],
												"readwrite"
											);
											let objectStore =
												transaction.objectStore(
													"Assets"
												);
											objectStore.delete(element.setId);
											objectStore =
												transaction.objectStore(
													"Files"
												);
											objectStore.delete(element.setId);
											objectStore =
												transaction.objectStore("Meta");
											objectStore.delete(element.setId);
											objectStore =
												transaction.objectStore(
													"Preview"
												);
											objectStore.delete(element.setId);
											let temp = metaData;
											temp = temp.filter(
												(x) => x.setId != element.setId
											);
											let temp2 = metaFiles;
											temp2 = temp2.filter(
												(x) => x.setId != element.setId
											);
											let box = document.getElementById(
												"element" + index
											);
											box.style.marginLeft = "150%";
											box.style.marginBottom = "0px";
											box.style.height = "0px";
											setTimeout(() => {
												setMetaData(temp);
												setMetaFiles(temp2);
											}, 300);
										};
									}}
									style={{
										opacity: deleteMode ? "1" : "0",
										pointerEvents: deleteMode
											? "all"
											: "none",
									}}>
									{crossIcon}
								</div>
							</div>
						</div>

						<div className="p-2 max-h-[calc(50vh-80px)] overflow-y-scroll  pt-3">
							<div
								className="levhol l   w-full p-2 -mt-2  "
								style={{
									height:
										96 +
										element.levels.length * 68 -
										96 +
										"px",
								}}>
								{element.levels.map((x, index2) => (
									<div
										key={"sub" + index + " " + index2}
										id={"sub" + index + " " + index2}
										className=" flex flex-col  justify-evenly rounded-md p-1 px-3 bg-blank bg-opacity-25 duration-300 w-full  text-[#eee] mb-2 h-[60px]"
										onClick={(e) => {
											setSecondaryIndex(index2);
											if (secondaryIndex == index2) {
												setStart(true);
											} else {
												setSecondaryIndex(index2);
												setPreviewImage(
													metaData[index].setId,
													x.backgroundImage,
													index2
												);
												previewCircleSize.style.width =
													x.circleSize * 10 + "%";
												previewApproachRate.style.width =
													x.approachRate * 10 + "%";
												previewHPDrain.style.width =
													x.hpDrainRate * 10 + "%";
												previewAccuracy.style.width =
													x.difficulty * 10 + "%";
												previewMapper.innerHTML =
													x.mapper;
												previewSource.innerHTML =
													utf8.decode(x.source);
												previewVersion2.innerHTML =
													x.level;
												previewTags.innerHTML =
													utf8.decode(x.tags);
												previewSong.innerHTML =
													element.title;
												previewArtist.innerHTML =
													element.artist;
												previewVersion.innerHTML =
													x.level;
											}
										}}
										style={{
											backgroundColor:
												secondaryIndex == index2
													? "#94a3b844"
													: "",
										}}>
										<div className=" pointer-events-none leading-[20px]">
											{x.level}
										</div>
										<div className=" pointer-events-none rounded-lg w-full  h-2 bg-white bg-opacity-30 ">
											<div
												className={
													" pointer-events-none rounded-lg h-2"
												}
												style={{
													width:
														x.difficulty * 10 + "%",
													background:
														x.difficulty <= 3.5
															? "#A3BE8C"
															: x.difficulty <= 7
															? "#EBCB8B"
															: x.difficulty <=
															  8.5
															? "#D08770"
															: "#BF616A",
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		);
	});
	function resetView() {
		previewCircleSize.style.width = 0 + "%";
		previewApproachRate.style.width = 0 + "%";
		previewHPDrain.style.width = 0 + "%";
		previewAccuracy.style.width = 0 + "%";
		previewMapper.innerHTML = "[Creator]";
		previewSource.innerHTML = "-";
		previewVersion2.innerHTML = "-";
		previewTags.innerHTML = "-";
		previewSong.innerHTML = "[Song]";
		previewArtist.innerHTML = "[Aritst]";
		previewVersion.innerHTML = "[Version]";
		try {
			setBackground("", true);
		} catch (_) {}
		try {
			playSong("", 0, 0, true);
		} catch (_) {}

		try {
			setPreviewImage(0, "", 0, true);
		} catch (_) {}
	}
	return (
		<>
			{" "}
			<div id="screen1">
				<div
					className="duration-300 fixed   text-3xl font-bold w-1/2 right-0 h-full  flex flex-col items-center  justify-center text-bact "
					style={{
						opacity:
							onlineMode && webSearchData.length < 1
								? "0.5"
								: "0",
					}}>
					<div>Search the web </div>
					<div> for beatmaps</div>
				</div>
				<div
					key={searchKey}
					id="scrollMenu"
					className=" duration-300 fixed overflow-y-scroll z-0 select-none  scroll-smooth overflow-x-visible right-0  bg -post  pl-4   w-[100vw] items-end justify-end  grid   h-[150%] pt-[calc(50vh-88px)]    "
					onScroll={(e) => {
						if (deleteMode || metaData.length < 1) return;

						scrollMenu.style.scrollSnapType = "none";
						let children = scrollMenu.children;
						let rect = [];
						let closest = 2;
						let clost = 0;
						for (let i = 0; i < children.length - 1; i++) {
							rect = children[i].getBoundingClientRect();
							let dist = rect.bottom / (window.innerHeight / 2);
							if (Math.abs(dist - 1) < closest) {
								closest = Math.abs(dist - 1);
								clost = i;
							}
						}

						setScrollIndex(clost);
						if (
							scrollMenu.scrollTop <
							(children.length - 1) * 88 +
								children[clost].getBoundingClientRect().height
						) {
							scrollMenu.style.top = 0;
							for (let i = 0; i < children.length - 1; i++) {
								children[i].className =
									defaultElementClass + " bg-opacity-10";

								children[i].style.marginRight =
									-Math.abs(clost - i) * 10 + "px";
								children[i].style.marginLeft =
									Math.abs(clost - i) * 10 + "px";
								children[i].style.height = 80 + "px";
							}
							scrollMenu.style.marginTop = 0 + "px";
							children[clost].className =
								defaultElementClass + " bg-opacity-20";

							children[clost].style.marginRight = 10 + "px";
							children[clost].style.marginLeft = -30 + "px";

							if (sctimer !== null) {
								clearTimeout(sctimer);
							}
							sctimer = setTimeout(async function () {
								scrollMenu.style.scrollSnapType = "y mandatory";
								await new Promise((r) => setTimeout(r, 10));
								sctimer = null;
								let children = scrollMenu.children;
								let rect = [];
								let closest = 2;
								let clost = 0;
								for (let i = 0; i < children.length - 1; i++) {
									rect = children[i].getBoundingClientRect();
									let dist =
										rect.bottom / (window.innerHeight / 2);
									if (Math.abs(dist - 1) < closest) {
										closest = Math.abs(dist - 1);
										clost = i;
									}
								}
								for (let i = 0; i < children.length - 1; i++) {
									if (i != clost) {
										children[i].className =
											defaultElementClass +
											" nons bg-opacity-10";
										children[i].style.marginRight =
											-Math.abs(clost - i) * 10 + "px";
										children[i].style.marginLeft =
											Math.abs(clost - i) * 10 + "px";
										children[i].style.height = 80 + "px";
									} else {
										children[clost].className =
											defaultElementClass +
											" sel bg-opacity-20";
										children[clost].style.marginRight =
											10 + "px";
										children[clost].style.marginLeft =
											-50 + "px";
										children[i].style.height = 80 + "px";
									}
								}
								children[clost].style.height =
									96 +
									metaData[clost].levels.length * 68 +
									"px";
								scrollMenu.style.marginTop =
									-children[clost].getBoundingClientRect()
										.height /
										2 +
									50 +
									"px";

								if (clost != globalIndex) {
									let x = metaData[clost].levels[0];
									playSong(
										metaData[clost].setId,
										0,
										x.previewTime
									);
									setBackground(
										metaData[clost].backgroundImage
									);
									setPreviewImage(
										metaData[clost].setId,
										x.backgroundImage,
										0
									);

									previewCircleSize.style.width =
										x.circleSize * 10 + "%";
									previewApproachRate.style.width =
										x.approachRate * 10 + "%";
									previewHPDrain.style.width =
										x.hpDrainRate * 10 + "%";
									previewAccuracy.style.width =
										x.difficulty * 10 + "%";
									previewMapper.innerHTML = x.mapper;
									previewSource.innerHTML = utf8.decode(
										x.source
									);
									previewVersion2.innerHTML = x.level;
									previewTags.innerHTML = utf8.decode(x.tags);
									previewSong.innerHTML =
										metaData[clost].title;
									previewArtist.innerHTML =
										metaData[clost].artist;
									previewVersion.innerHTML = x.level;

									setGlobalIndex(clost);

									setSecondaryIndex(0);
									await new Promise((r) =>
										setTimeout(r, 100)
									);

									
									setPrevMusic([
										metaData[clost].setId,
										0,
										x.previewTime,
									]);
									return;
								}
							}, 1000);
						} else {
							scrollMenu.scrollTop = children.length * 88;
						}
					}}
					style={{
						scrollSnapType: "y mandatory",
						opacity: start || onlineMode ? 0 : 1,
						pointerEvents: start || onlineMode ? "none" : "auto",
					}}>
					{list}

					<div
						id="emptyy2"
						className=" h-[110vh]"
						onDragCapture={(e) => {
							e.preventDefault();
						}}></div>
				</div>
				<div
					key={searchKey + "2"}
					id="scrollMenu2"
					className=" duration-300 fixed overflow-y-scroll z-0 select-none  scroll-smooth overflow-x-visible right-0  bg -post  pl-4   w-[100vw] items-end justify-end  grid   h-[150%] pt-[calc(50vh-88px)]    "
					onScroll={(e) => {
						if (onlineMode && webSearchData.length < 1) return;
						scrollMenu2.style.scrollSnapType = "none";
						let children = scrollMenu2.children;
						let rect = [];
						let closest = 2;
						let clost = 0;
						for (let i = 0; i < children.length - 1; i++) {
							rect = children[i].getBoundingClientRect();
							let dist = rect.bottom / (window.innerHeight / 2);
							if (Math.abs(dist - 1) < closest) {
								closest = Math.abs(dist - 1);
								clost = i;
							}
						}

						setScrollIndex(clost);
						if (
							scrollMenu2.scrollTop <
							(children.length - 1) * 88 +
								children[clost].getBoundingClientRect().height
						) {
							scrollMenu2.style.top = 0;
							for (let i = 0; i < children.length - 1; i++) {
								children[i].className =
									defaultElementClass + " bg-opacity-10";

								children[i].style.marginRight =
									-Math.abs(clost - i) * 10 + "px";
								children[i].style.marginLeft =
									Math.abs(clost - i) * 10 + "px";
								children[i].style.height = 80 + "px";
							}
							scrollMenu2.style.marginTop = 0 + "px";
							children[clost].className =
								defaultElementClass + " bg-opacity-20";

							children[clost].style.marginRight = 10 + "px";
							children[clost].style.marginLeft = -30 + "px";

							if (sctimer !== null) {
								clearTimeout(sctimer);
							}
							sctimer = setTimeout(async function () {
								scrollMenu2.style.scrollSnapType =
									"y mandatory";
								await new Promise((r) => setTimeout(r, 10));
								sctimer = null;
								let children = scrollMenu2.children;
								let rect = [];
								let closest = 2;
								let clost = 0;
								for (let i = 0; i < children.length - 1; i++) {
									rect = children[i].getBoundingClientRect();
									let dist =
										rect.bottom / (window.innerHeight / 2);
									if (Math.abs(dist - 1) < closest) {
										closest = Math.abs(dist - 1);
										clost = i;
									}
								}
								for (let i = 0; i < children.length - 1; i++) {
									if (i != clost) {
										children[i].className =
											defaultElementClass +
											" nons bg-opacity-10";
										children[i].style.marginRight =
											-Math.abs(clost - i) * 10 + "px";
										children[i].style.marginLeft =
											Math.abs(clost - i) * 10 + "px";
										children[i].style.height = 80 + "px";
									} else {
										children[clost].className =
											defaultElementClass +
											" sel bg-opacity-20";
										children[clost].style.marginRight =
											10 + "px";
										children[clost].style.marginLeft =
											-50 + "px";
										children[i].style.height = 80 + "px";
									}
								}
								children[clost].style.height = 80; //96 +
								//webSearchData[clost].levels.length * 68 +
								("px");
								scrollMenu2.style.marginTop =
									-children[clost].getBoundingClientRect()
										.height /
										2 +
									50 +
									"px";

								if (clost != globalIndex) {
									let x = null; //webSearchData[clost].levels[0];
									playSong(
										webSearchData[clost].songPreview,
										0,
										0,
										true
									);
									setBackground(
										webSearchData[clost].backgroundImage,
										true
									);
									setPreviewImage(
										webSearchData[clost].setId,
										webSearchData[clost].backgroundImage,
										0,
										true
									);

									if (webSearchData.length < 1) {
										previewCircleSize.style.width =
											x.circleSize * 10 + "%";
										previewApproachRate.style.width =
											x.approachRate * 10 + "%";
										previewHPDrain.style.width =
											x.hpDrainRate * 10 + "%";
										previewAccuracy.style.width =
											x.difficulty * 10 + "%";
										previewMapper.innerHTML = x.mapper;
										previewSource.innerHTML = utf8.decode(
											x.source
										);
										previewVersion2.innerHTML = x.level;
										previewTags.innerHTML = utf8.decode(
											x.tags
										);
										previewSong.innerHTML =
											webSearchData[clost].title;
										previewArtist.innerHTML =
											webSearchData[clost].artist;
										previewVersion.innerHTML = x.level;
									}
									setGlobalIndex(clost);

									setSecondaryIndex(0);
									await new Promise((r) =>
										setTimeout(r, 100)
									);

									

									return;
									setPrevMusic([
										webSearchData[clost].setId,
										0,
										x.previewTime,
									]);
									return;
								}
							}, 1000);
						} else {
							scrollMenu2.scrollTop = children.length * 88;
						}
					}}
					style={{
						scrollSnapType: "y mandatory",
						opacity: start || !onlineMode ? 0 : 1,
						pointerEvents: start || !onlineMode ? "none" : "auto",
					}}>
					{list2}

					<div
						id="emptyy"
						className=" h-[110vh]"
						onDragCapture={(e) => {
							e.preventDefault();
						}}></div>
				</div>
				<div
					style={{
						opacity: start ? 0 : 1,
					}}
					id="previewSearch"
					className="w-full h-full flex pointer-events-none flex-col bg- black  fixed ">
					<div
						style={{
							pointerEvents: start ? "none" : "auto",
						}}
						className="bg-post flex items-center justify-end gap-2 pr-2 duration-300 bg-opacity-25 z-20   border-bcol h-[60px] max-h-[10vh] border-b   backdrop-blur-md border-1 w-full  top-0 left-0  ">
						<div
							onClick={() => {
								let dm = deleteMode;
								dm = !dm;
								let children = scrollMenu.children;
								setDeleteMode(dm);
								if (dm) {
									for (
										let i = 0;
										i < children.length - 1;
										i++
									) {
										children[i].className =
											defaultElementClass +
											" bg-opacity-10";

										children[i].style.marginRight =
											10 + "px";
										children[i].style.marginLeft =
											10 + "px";
										children[i].style.height = 80 + "px";
									}
								} else {
									setGlobalIndex(-1);
									scrollMenu.scrollTo({
										top: scrollMenu.scrollTop - 2,
										behavior: "smooth",
									});

									scrollMenu.scrollTo({
										top: scrollMenu.scrollTop + 2,
										behavior: "smooth",
									});
								}
							}}
							className="bg-post p-1 outline-[#93939300] outline-1 text-bcol duration-300  bg-opacity-0  outline hover:text-bact  rounded-lg aspect-square h-2/3"
							style={{
								color: deleteMode ? "#b3b3b3" : "",
								outlineColor: deleteMode ? "#939393" : "",
								backgroundColor: deleteMode ? "#2525254C" : "",
								opacity: !onlineMode ? "1" : "0",
							}}>
							{deleteIcon}
						</div>
						
						<div
							className="bg-post p-1 outline-[#93939300] outline-1 text-bcol duration-300  bg-opacity-0  outline hover:text-bact  rounded-lg aspect-square h-2/3"
							style={{
								opacity: !onlineMode ? "1" : "0.25",
							}}>
							{offlineButton}
						</div>
						<div
							className="bg-post  outline-[#9393934C] outline-1 text-bcol duration-300  bg-opacity-50 flex  items-center  outline hover:text-bact  rounded-full aspect-video h-1/3"
							onClick={() => {
								setOnlineMode(!onlineMode);
								setWebSearchData([]);
								resetView();
								searchbox.value = "";
								setGlobalIndex(-1);
								setSecondaryIndex(0);

								if (onlineMode) {
									scrollMenu.scrollTo({
										top: scrollMenu.scrollTop - 2,
										behavior: "smooth",
									});

									scrollMenu.scrollTo({
										top: scrollMenu.scrollTop + 2,
										behavior: "smooth",
									});
								}
							}}
							style={{
								backgroundColor: onlineMode ? "#9393934C" : "",
							}}>
							<div
								className="bg-[#9393934C] duration-300  h-3/4 aspect-square rounded-full"
								style={{
									backgroundColor: onlineMode
										? "#939393"
										: "",
									marginLeft: onlineMode ? "50%" : "5%",
								}}></div>
						</div>
						<div
							className="bg-post p-1 outline-[#93939300] outline-1 text-bcol duration-300  bg-opacity-0  outline hover:text-bact  rounded-lg aspect-square h-2/3"
							style={{
								opacity: onlineMode ? "1" : "0.25",
							}}>
							{onlineButton}
						</div>
						<div className="bg-post p-1 pl-2 outline-bcol outline-1 flex items-center   outline bg-opacity-30 rounded-lg w-[20vw] h-2/3 ">
							<input
								id="searchbox"
								placeholder="Search"
								onChange={(e) => {
									if (typetimer !== null) {
										clearTimeout(typetimer);
									}
									typetimer = setTimeout(() => {
										if (minis == null) return;
										if (e.target.value == "") {
											if (onlineMode) {
												setWebSearchData([]);
												resetView();
												searchbox.value = "";
												setGlobalIndex(-1);
												setSecondaryIndex(0);
												return;
											}
											setMetaData(metaFiles);
											let ind = -1;
											try {
												if (
													metaData[0].setId ==
													metaFiles[0].setId
												)
													ind = 0;
											} catch {}
											setGlobalIndex(ind);
											setSecondaryIndex(0);
											setSearchKey(0);
											fakeClick(0, true);

											return;
										}
										if (onlineMode) {
											fetch(uri + "/search", {
												method: "POST",
												headers: {
													"Content-Type":
														"application/json",
												},
												body: JSON.stringify({
													query: e.target.value,
												}),
											})
												.then((response) =>
													response.json()
												)
												.then((data) => {
													resetView();

													let res = data;
													let maps = [];
													console.log(
														JSON.parse(
															res.result[0]
														)
													);
													for (let i in res.result) {
														let x = JSON.parse(
															res.result[i]
														);
														maps.push({
															artist: x.artist,
															backgroundImage:
																x.covers
																	.cover_2x,
															creator: x.creator,
															levels: [],
															setId: x.id,
															source: x.source,
															tags: x.tags,
															title: x.title,
															songPreview:
																"https:" +
																x.preview_url,
														});
													}
													console.log(maps[0]);
													setWebSearchData(maps);
													setSearchKey(searchKey + 1);
													let ind = -1;
													setGlobalIndex(ind);
													setSecondaryIndex(0);
													fakeClick(0, true, true);
												});
											return;
										}
										let res = minis.search(e.target.value);
										let temp = [];
										for (let i in res) {
											let val = metaFiles.find(
												(x) => x.setId == res[i].setId
											);
											if (val != undefined && val != null)
												temp.push(val);
										}
										setMetaData(temp);
										setSearchKey(searchKey + 1);
										let ind = -1;
										try {
											if (
												metaData[0].setId ==
												temp[0].setId
											)
												ind = 0;
										} catch {}
										setGlobalIndex(ind);
										setSecondaryIndex(0);
										fakeClick(0, true);
									}, 1000);
								}}
								type="text"
								className="  text-xs sm:text-sm lg:text-base -mt-[1Px] w-full  text-slate-200 bg-white bg-opacity-0 border-none outline-none focus:border-none rounded-md"
							/>
						</div>
						<div
							id="resetButton"
							className="w-16 h-16 bg-black hidden"
							onClick={() => {
								setMetaData(metaFiles);
								let ind = -1;
								setSearchKey(0);
								if (metaData[0].setId == metaFiles[0].setId)
									return;
								setGlobalIndex(ind);
								setSecondaryIndex(0);

								fakeClick(0, true);
							}}></div>
						
					</div>
					{focus && ((metaFiles.length > 0 && !onlineMode)||(onlineMode)) ? <Preview /> : <></>}
				</div>
				<div
					style={{ opacity: start ? 0 : 1 }}
					id="addOSZButton"
					className="w-full flex items-end gap-3 p-3 duration-300 h-full fixed z-20 pointer-events-none">
					<label
						//style={{ display: !props.playing ? "" : "none" }}
						htmlFor="inpp"
						className="pointer-events-auto  bg-opacity-75  aspect-[2.2/1] flex items-center justify-center  bg-post border text-bact border-bcol h-12  text-xs sm:text-sm lg:text-base max-h-[10vh] z-[11]  rounded-md shadow-lg  cursor-pointer   text-center ">
						<input
							multiple
							type="file"
							className="hidden"
							id="inpp"
							accept=".osz"
							onChange={(e) => {
								getFiles(e.target.files);
							}}
						/>
						Upload
					</label>
					<div className="text-bhov fixed bottom-0 right-0 duration-300 flex flex-col bg-post  bg-opacity-75  h-[4vh] pt-[0.5vh] w-[24vh]  overflow-clip rounded-tl-md"
					style={{opacity:!inter?"1":"0"}}
					>
							<div className="h-fit text-[2vh] w-full text-center  overflow-clip font-thin">Click anywhere to unmute</div>
						</div>
					<button
						//style={{ display: !props.playing ? "" : "none" }}
						style={{
							opacity: metaFiles.length < 1 ? 1 : 0,
							pointerEvents:
								metaFiles.length < 1 ? "auto" : "none",
						}}
						onClick={(e) => {
							fetch(
								"/demo1.osz" // Fetches the file
							)
								.then((res) => res.blob()) // Gets the response and returns it as a blob
								.then((blob) => {
									let file = new File([blob], "demo1.osz", {
										type: "application/octet-stream",
									});
									console.log(file);
									getFiles([file]);
								});
							fetch(
								"/demo2.osz" // Fetches the file
							)
								.then((res) => res.blob()) // Gets the response and returns it as a blob
								.then(async (blob) => {
									let file = new File([blob], "demo1.osz", {
										type: "application/octet-stream",
									});
									console.log(file);
									getFiles([file], true);
								});

							return;
						}}
						className=" pointer-events-auto  bg-opacity-75 aspect-[2.2/1]  bg-post border text-bact border-bcol h-12  text-xs sm:text-sm lg:text-base max-h-[10vh]  z-[11] duration-300 rounded-md shadow-lg  cursor-pointer   text-center ">
						Load Demo
					</button>
					<div
						className="absolute hidden w-16 aspect-square bg-black"
						style={{
							top: 0,
							left: 0,
							animation: "move 10s linear infinite alternate",
							offsetPath:
								"path(' M 466 283 L 493 249 M 493 249 L 482 196')",
						}}></div>
				</div>
				<div
					style={{ opacity: start ? 1 : 0 }}
					id="load"
					className="w-full opacity-0 duration-300 flex items-center justify-center z-30 pointer-events-none h-full fixed bg-black bg-opacity-25 ">
					<div className=" text-bact text-[30px] font-bold bg-bcol  shadow-md border border-[#777] bg-opacity-25 rounded-lg p-3">
						{loader}
					</div>
				</div>
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
						{exit}
					</div>
					<div
						onClick={() => {
							pauseMenu.style.opacity = "0";
							pauseMenu.style.pointerEvents = "none";
							setStart(false);
							setAttempts(attempts + 1);
							setTimeout(() => {
								setStart(true);
							}, 10);
						}}
						className="w-16 h-16 bg-post outline outline-1 bg-opacity-50 outline-colors-yellow rounded-md text-center leading-[3.6rem]">
						{replay}
					</div>
					<div
						onClick={() => {
							pauseMenu.style.opacity = "0";

							pauseMenu.style.pointerEvents = "none";
							setTimeout(() => {
								play(playArea);
							}, 1000);
						}}
						className="w-16 h-16 bg-post outline outline-1 bg-opacity-50 outline-colors-green rounded-md text-center leading-[3.6rem]">
						{playButton2}
					</div>
				</div>
				<div
					onClick={() => {
						setFocus(!focus);
					}}
					style={{
						opacity: focus ? 0 : 1,
						pointerEvents: focus ? "none" : "auto",
						filter: focus ? "blur(0px)" : "",
					}}
					id="load2"
					className="w-full  duration-300 text-bcol flex items-center justify-center z-40 h-full fixed bg-black bg-opacity-50  backdrop-blur-md ">
					<div className="text-xl font-bold bg-black ">
						Click to Start
					</div>
				</div>
			</div>
			{start ? (
				<PlayArea
					setId={metaData[globalIndex].setId}
					id={metaData[globalIndex].levels[secondaryIndex].id}
					setStart={setStart}
					attempts={attempts}
				/>
			) : (
				<></>
			)}
		</>
	);
}

export default SongSelectionMenu;
