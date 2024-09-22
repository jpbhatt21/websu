import JSZip from "jszip";
import Preview from "./Preview";
import { useEffect, useState } from "react";
import MiniSearch from "minisearch";
import utf8 from "utf8";
import {
	fakeClick,
	getBeatMapCollectionInfo,
	getIndividualBeatMapInfo,
	playSong,
	setBackground,
	setPreviewImage,
	music,
	backgroundImage,
	colors,
	pause,
	play,
} from "./Utils";
import { svg } from "./VectorGraphics";
import PlayArea from "./PlayArea";
import { uri, uri2 } from "./App";
import MusicPlayer from "./MusicPlayer";
import { settingsVal } from "./SettingsVal";

let typetimer = null;
let sctimer = null;
let scrPos = 0;
let musicTimer = null;
let minis = null;
let loadTime = null;
let past5 = [0, 0, 0, 0, 0];
let initT = 0;
function displayFps(time) {
	let diff = time - initT;
	let fps = 1000 / diff;
	initT = time;

	if (fps < 600) {
		past5.shift();
		past5.push(fps);
		fps = past5.reduce((a, b) => a + b, 0) / 5;
		if (Math.abs(fps - document.getElementById("fps").innerHTML) > 5) {
			document.getElementById("fps").innerHTML = parseInt(fps);
			document.getElementById("lat").innerHTML = parseInt(diff);
		}
	}
	window.requestAnimationFrame(displayFps);
}
function getFps() {
	window.requestAnimationFrame(displayFps);
}
let onLD = () => {};
function SongSelectionMenu() {
	let defaultElementClass =
		"bg-blank  outline fade-in outline-1 mb-[8px] mr-[10px] ml-[10px] outline-bcol duration-300 w-[45vw] rounded-md text-gray-300 max-h-[50vh] shadow-lg nons snap-cetner overflow-hidden " +
		(settingsVal.showBackground ? "bg-opacity-20" : "");
	async function getFiles(files, mode = false) {
		setUnzipTotal((prev) => prev + files.length);
		for (let i = 0; i < files.length; i++) {
			try {
				if (files[i].name.includes(".osz")) {
					await getOszFileToUnzip(
						files[i],
						mode,
						false,
						i == files.length - 1
					);
				} else {
					continue;
					handleNonOszFiles(files[i]);
				}
			} catch (e) {}
		}
	}
	async function getOszFileToUnzip(file, mode, mode2 = false, end = false) {
		let zip = new JSZip();
		let osuFiles = [];
		let assets = [];
		let unzipOsz = await zip.loadAsync(file).then(async function (zip) {
			for (let i in zip.files) {
				let loadIndividualFiles = zip
					.file(i)
					.async("base64")
					.then(function (blob) {
						if (i.slice(i.length - 4, i.length) === ".osu") {
							osuFiles.push(blob);
						} else {
							assets.push({ name: i, file: blob });
						}
					});
				await loadIndividualFiles;
			}
		});
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
		let pre = "websu";
		if (mode2) pre = "tempWebsu";
		function setData() {
			return new Promise((resolve, reject) => {
				const request = indexedDB.open(pre + "Storage", 2);
				request.onsuccess = function (event) {
					const db = event.target.result;
					const transaction = db.transaction(
						["Assets", "Files", "Meta", "Preview"],
						"readwrite"
					);
					transaction.oncomplete = function () {
						resolve();
					};
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
					if (mode2 && mode) {
						setTempFiles((prev) => [...prev, setMeta]);
						setStart(true);
					}
					if (mode2) return;
					if (webSearchData.length > 0) exisiting.push(setMeta.setId);
					setMeta.id = metaData.length;
					setMetaData((prev) => [
						...prev.filter((x) => x.setId != setMeta.setId),
						setMeta,
					]);
					setMetaFiles((prev) => [
						...prev.filter((x) => x.setId != setMeta.setId),
						setMeta,
					]);
					try {
						minis.add(setMeta);
					} catch (e) {}

					if (mode) return;
					else if (scrollMenu.style.opacity == 1) {
						fakeClick(Math.max(metaData.length, 1), false);
						setSearchKey(searchKey + 1);
					} else {
					}
				};
			});
		}
		await setData();
		setUnzipCounter((prev) => prev + 1);
	}
	const [metaData, setMetaData] = useState([]);
	const [webSearchData, setWebSearchData] = useState([]);
	const [metaFiles, setMetaFiles] = useState([]);
	const [tempFiles, setTempFiles] = useState([]);
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
	const [savedPos, setSavedPos] = useState(false);
	const [osuDirect, setOsuDirect] = useState(!true);
	const [exisiting, setExisting] = useState([]);
	const [tempOnline, setTempOnline] = useState(false);
	const [stationary, setStationary] = useState(false);
	const [switchToggle, setSwitchToggle] = useState(false);
	const [unzipCounter, setUnzipCounter] = useState(0);
	const [unzipTotal, setUnzipTotal] = useState(0);
	useEffect(() => {
		if (unzipCounter == unzipTotal && unzipTotal > 0) {
			unzippingSet.style.height = "";
			unzippingSet.style.opacity = "";
			setSaved.style.opacity = "1";
			setSaved.style.height = "3.5vh";
			setTimeout(() => {
				setSaved.style.opacity = "0";
				setSaved.style.height = "0vh";
				setUnzipCounter(0);
				setUnzipTotal(0);
			}, 1000);
		} else if (unzipTotal > 0) {
			unzippingSet.style.height = "3.5vh";
			unzippingSet.style.opacity = "1";
		}
	}, [unzipCounter, unzipTotal]);
	const [downloadHead, setDownloadHead] = useState(0);
	const [activeDownload, setActiveDownload] = useState(false);
	const [downloadQueue, setDownloadQueue] = useState([]);
	useEffect(() => {
		if (
			!activeDownload &&
			downloadQueue.length > 0 &&
			downloadHead >= downloadQueue.length
		) {
			setDownloadQueue([]);
			setDownloadHead(0);
			fetchingSet.style.height = "";
			fetchingSet.style.opacity = "";
		} else if (
			downloadQueue.length > 0 &&
			downloadHead < downloadQueue.length &&
			!activeDownload
		) {
			fetchingSet.style.height = "3.5vh";
			fetchingSet.style.opacity = "1";
			setActiveDownload(true);
			fetch(uri2 + "/d/" + downloadQueue[downloadHead][0])
				.then((res) => res.blob())
				.then((blob) => {
					let file = new File([blob], "test.osz", {
						type: "application/octet-stream",
					});
					setUnzipTotal((prev) => prev + 1);
					setDownloadHead((prev) => prev + 1);
					setActiveDownload(false);
					getOszFileToUnzip(
						file,
						true,
						downloadQueue[downloadHead][1]
					);
				});
		}
	}, [downloadHead, downloadQueue]);
	let loadLimit = parseInt(window.innerHeight / 88);
	if (loadLimit < 6) loadLimit = 6;
	if (start || !settingsVal.blur) {
		backgroundImage.style.filter = "blur(0px) brightness(0.5)";
	} else {
		backgroundImage.style.filter = "blur(12px) brightness(0.5)";
	}
	function keyaction(e) {
		if (previewSearch.style.opacity == 1) {
			if (!start && e.key == "Escape") {
				searchbox.value = "";
				searchbox.blur();
				if (!onlineMode) resetButton.click();
				else setWebSearchData([]);
				setSearchKey(searchKey + 1);
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
				if (
					root.style.animationPlayState != "paused" &&
					!music.paused
				) {
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
	useEffect(() => {
		if (!focus) return;
		loadTime = new Date().getTime();
		document.addEventListener("keydown", keyaction);

		const request = indexedDB.open("websuStorage", 2);
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
						setTimeout(() => {}, 2000);
					}, 10);
				};
			return;
		};
		const request2 = indexedDB.open("tempWebsuStorage", 2);
		request2.onupgradeneeded = function (event) {
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
		};
		request2.onsuccess = function (event) {
			let db = event.target.result;
			db.transaction("Meta").objectStore("Meta").getAll().onsuccess =
				function (event) {
					if (event.target.result.length > 0) {
						const request3 =
							indexedDB.deleteDatabase("tempWebsuStorage");
						request3.onsuccess = () => {
							const request4 = indexedDB.open(
								"tempWebsuStorage",
								2
							);
							request4.onupgradeneeded = function (event) {
								const db = event.target.result;
								let objectStore = db.createObjectStore(
									"Files",
									{
										keyPath: "setId",
									}
								);
								objectStore = db.createObjectStore("Assets", {
									keyPath: "setId",
								});
								objectStore = db.createObjectStore("Meta", {
									keyPath: "setId",
								});
								objectStore = db.createObjectStore("Preview", {
									keyPath: "setId",
								});
							};
						};
					}
				};
		};
	}, [focus]);
	useEffect(() => {
		if (!start && prevMusic.length > 0) {
			musicTimer = setTimeout(() => {
				playSong(
					prevMusic[0],
					prevMusic[1],
					prevMusic[2],
					prevMusic[3],
					prevMusic[4]
				);
			}, 100);
		} else if (musicTimer != null) {
			clearTimeout(musicTimer);
		}
	}, [start]);
	if (
		!settingsVal.showBanners &&
		metaData.length > 0 &&
		metaData[0].backgroundImage != ""
	) {
		let temp = metaData.map((x) => {
			x.backgroundImage = "";
			return x;
		});
		let temp2 = metaFiles.map((x) => {
			x.backgroundImage = "";
			return x;
		});
		setMetaData(temp);
		setMetaFiles(temp2);
	}
	let list = (onlineMode ? webSearchData : metaData).map((element, index) => {
		return (
			<div
				key={"element" + (onlineMode ? "2" : "") + element.setId}
				id={"element" + (onlineMode ? "2" : "") + index}
				style={{
					marginRight:
						(deleteMode && !onlineMode
							? 1
							: -Math.abs(scrollIndex - index)) *
							20 +
						"px",
					marginLeft:
						(deleteMode && !onlineMode
							? 10
							: scrollIndex == index
							? stationary
								? "-50"
								: "-25"
							: Math.abs(scrollIndex - index) * 20) + "px",
					height:
						(scrollIndex == index &&
						stationary &&
						(!deleteMode || onlineMode)
							? 96 + element.levels.length * 68
							: "80") + "px",
				}}
				className={defaultElementClass}>
				{Math.abs(scrollIndex - index) < loadLimit || onlineMode ? (
					<>
						<div
							onClick={(e) => {
								if (e.target != e.currentTarget) return;
								if (!deleteMode || onlineMode)
									fakeClick(index, false);
							}}
							className=" w-full h-20  flex   outline outline-1 outline-bcol   rounded-t-lg"
							style={{
								backgroundImage: settingsVal.showBanners
									? "url(" +
									  (onlineMode
											? ""
											: "data:image/png;base64,") +
									  element.backgroundImage +
									  ")"
									: "",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}>
							<div className="h-full w-full flex flex-row items-center bg-blank pointer-events-none px-3  justify-between bg-opacity-60">
								{onlineMode ? (
									<div
										id={"delete2" + index}
										className="h-1/2 duration-300 flex items-center justify-center overflow-hidden  text-bcol hover:text-colors-red aspect-square"
										onClick={(e) => {
											e.preventDefault();
											// if (
											// 	fetchingSet.style.height !=
											// 		"" ||
											// 	unzippingSet.style.height != ""
											// ) {
											// 	waitDC.style.height = "6vh";
											// 	waitDC.style.opacity = "1";
											// 	setTimeout(() => {
											// 		waitDC.style.height = "";
											// 		waitDC.style.opacity = "";
											// 	}, 1000);
											// 	return;
											// }

											setDownloadQueue((prev) => [
												...prev,
												[element.setId, false],
											]);
										}}
										style={{
											opacity: deleteMode ? "1" : "1",
											pointerEvents: true
												? "all"
												: "none",
											aspectRatio: exisiting.includes(
												element.setId
											)
												? "1 / 1000"
												: "",
										}}>
										<div className="h-1/2 aspect-square">
											{svg.donwloadIcon}
										</div>
									</div>
								) : (
									<></>
								)}
								<div className="flex w-full flex-col h-full items-center py-2">
									<div className="flex leading-[40px] w-full   whitespace-nowrap text-ellipsis font-semibold text-[30px] pointer-events-none  self-start text-[#ccc] ">
										{element.title}
									</div>
									<div className="flex leading-[20px] w-full   whitespace-nowrap text-ellipsis  self-start ml-2 text-[#bbb] mb-[20px]  pointer-events-none text-[18px]">
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
											"websuStorage",
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
										opacity:
											deleteMode && !onlineMode
												? "1"
												: "0",
										pointerEvents:
											deleteMode && !onlineMode
												? "all"
												: "none",
									}}>
									{svg.crossIcon}
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
										className=" flex flex-col  justify-evenly rounded-md p-1 px-3 bg-post bg-opacity-25 duration-300 w-full  text-[#eee] mb-2 h-[60px]"
										onClick={(e) => {
											setSecondaryIndex(index2);
											if (secondaryIndex == index2) {
												if (!onlineMode) setStart(true);
												else {
													let y = tempFiles.filter(
														(x) =>
															x.setId ==
															element.setId
													);
													let z = metaFiles.filter(
														(x) =>
															x.setId ==
															element.setId
													);
													console.log(z);
													if (z.length > 0) {
														setTempOnline(false);
														setStart(true);
														return;
													}
													setTempOnline(true);

													if (y.length > 0) {
														setStart(true);
														return;
													}
													setDownloadQueue((prev) => [
														...prev,
														[element.setId, true],
													]);

													return;
												}
											} else {
												setSecondaryIndex(index2);
												if (!onlineMode)
													setPreviewImage(
														element.setId,
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
												previewVersion2.innerHTML =
													x.level;
												previewVersion.innerHTML =
													x.level;
											}
										}}
										style={{
											backgroundColor:
												secondaryIndex == index2
													? "#94a3b844"
													: settingsVal.showBackground
													? ""
													: "#252525",
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
		} catch (e) {}
		try {
			playSong("", 0, 0, "-", true);
		} catch (e) {}

		try {
			setPreviewImage(0, "", 0, true);
		} catch (e) {}
	}
	let st = null;
	let count = 0;

	return (
		<>
			{" "}
			<div id="screen1">
				<div
					className="duration-300 fixed overflow-hidden  pointer-events-none  text-3xl font-bold w-1/2 right-0 h-full  flex flex-col items-center  justify-center text-bact "
					style={{
						opacity:
							!onlineMode && !switchToggle && metaData.length < 1
								? "0.5"
								: "0",
					}}>
					<div>
						<label
							htmlFor="inpp"
							className=" hover:text-white duration-300 pointer-events-auto">
							Upload
						</label>{" "}
						a beatmap set,
					</div>
					<div>
						<label
							htmlFor="loadDemo"
							className=" hover:text-white duration-300 pointer-events-auto">
							load demo
						</label>{" "}
						, or{" "}
					</div>
					<div>
						{" "}
						switch to{" "}
						<label
							className=" hover:text-white duration-300 pointer-events-auto"
							onClick={() => {
								setSwitchToggle(true);
								setTimeout(() => {
									setOnlineMode(true);
								}, 300);
							}}>
							online mode
						</label>{" "}
					</div>
				</div>
				<div
					className="duration-300 fixed overflow-hidden  pointer-events-none  text-3xl font-bold w-1/2 right-0 h-full  flex flex-col items-center  justify-center text-bact "
					style={{
						opacity:
							onlineMode &&
							switchToggle &&
							webSearchData.length < 1
								? "0.5"
								: "0",
					}}>
					<div>Search the web</div>
					<div>for beatmaps</div>
				</div>
				<div
					key={searchKey}
					id="scrollMenu"
					className=" duration-300 fixed overflow-y-scroll z-0 select-none  scroll-smooth overflow-x-hidden right-0  bg -post  pl-4   w-[100vw] items-end justify-end fade-in  grid   h-[150%] pt-[calc(50vh-88px)]    "
					onScroll={(e) => {
						let select = onlineMode ? webSearchData : metaData;
						let clost = Math.min(
							parseInt(scrollMenu.scrollTop / 88),
							select.length - 1
						);
						if (clost != scrollIndex) setScrollIndex(clost);
						if (onlineMode && webSearchData.length < 1) return;
						if (!onlineMode && (deleteMode || metaData.length < 1))
							return;
						
						scrollMenu.style.scrollSnapType = "none";
						let children = scrollMenu.children;
						if (
							scrollMenu.scrollTop <
							(children.length - 1) * 88 +
								children[clost].getBoundingClientRect().height
						) {
							scrollMenu.style.top = 0;
							scrollMenu.style.marginTop = 0 + "px";
							setStationary(false);
							if (sctimer !== null) {
								clearTimeout(sctimer);
							}
							sctimer = setTimeout(async function () {
								setStationary(true);
								scrollMenu.style.scrollSnapType = "y mandatory";
								await new Promise((r) => setTimeout(r, 10));
								sctimer = null;
								let children = scrollMenu.children;
								let clost = Math.min(
									parseInt(scrollMenu.scrollTop / 88),
									select.length - 1
								);
								scrollMenu.style.marginTop =
									-children[clost].getBoundingClientRect()
										.height /
										2 +
									50 +
									"px";
								if (clost != globalIndex) {
									let x = select[clost].levels[0];
									let y = select[clost];
									playSong(
										onlineMode ? y.songPreview : y.setId,
										0,
										onlineMode ? 0 : x.previewTime,
										y.title,
										onlineMode
									);

									setPreviewImage(
										y.setId,
										onlineMode
											? y.backgroundImage
											: x.backgroundImage,
										0,
										onlineMode
									);

									previewCircleSize.style.width =
										x.circleSize * 10 + "%";
									previewApproachRate.style.width =
										x.approachRate * 10 + "%";
									previewHPDrain.style.width =
										x.hpDrainRate * 10 + "%";
									previewAccuracy.style.width =
										x.difficulty * 10 + "%";

									previewMapper.innerHTML = y.creator;
									try {
										previewSource.innerHTML = onlineMode
											? y.source
											: utf8.decode(y.source);
									} catch (e) {}
									previewVersion2.innerHTML = x.level;
									try {
										previewTags.innerHTML = onlineMode
											? y.tags
											: utf8.decode(y.tags);
									} catch (e) {}
									previewSong.innerHTML = y.title;
									previewArtist.innerHTML = y.artist;
									previewVersion.innerHTML = x.level;
									setGlobalIndex(clost);
									setSecondaryIndex(0);
									await new Promise((r) =>
										setTimeout(r, 100)
									);
									setPrevMusic([
										onlineMode ? y.songPreview : y.setId,
										0,
										onlineMode ? 0 : x.previewTime,
										y.title,
										onlineMode,
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
						opacity: start ? 0 : 1,
						pointerEvents:
							start ||
							(metaData.length < 1 && webSearchData.length < 1)
								? "none"
								: "auto",
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
					style={{
						opacity: start ? 0 : 1,
					}}
					id="previewSearch"
					className="w-full h-full flex pointer-events-none flex-col bg- black  fixed ">
					<div
						style={{
							pointerEvents: start ? "none" : "auto",
							backgroundColor: !settingsVal.showBackground
								? "#252525"
								: !settingsVal.blur
								? "#25252599"
								: "",
							backdropFilter: !settingsVal.blur
								? "blur(0px)"
								: "",
							WebkitBackdropFilter: !settingsVal.blur
								? " blur(0px) "
								: "",
						}}
						className="bg-post flex items-center justify-end gap-2 pr-2 duration-300 bg-opacity-25 z-20   border-bcol h-[60px] min-h-[5vh] max-h-[10vh] border-b-2  backdrop-blur-md   w-full  top-0 left-0  ">
						<MusicPlayer />
						<div
							onClick={() => {
								let dm = deleteMode;
								dm = !dm;
								let children = scrollMenu.children;
								setDeleteMode(dm);
								if (dm) {
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
								opacity: !switchToggle ? "1" : "0",
							}}>
							{svg.deleteIcon}
						</div>

						<div
							className="bg-post p-1 outline-[#93939300] outline-1 text-bcol duration-300  bg-opacity-0  outline hover:text-bact  rounded-lg aspect-square h-2/3"
							style={{
								opacity: !switchToggle ? "1" : "0.25",
							}}>
							{svg.offlineIcon}
						</div>
						<div
							className="bg-post  outline-[#9393934C] outline-1 text-bcol duration-300  bg-opacity-50 flex  items-center  outline hover:text-bact  rounded-full aspect-video h-1/3"
							onClick={() => {
								let prev = savedPos;
								sctimer = null;
								scrollMenu.style.opacity = 0;
								setSavedPos(scrollMenu.scrollTop);
								resetView();
								music.src = "";
								setSwitchToggle(!onlineMode);
								setTimeout(() => {
									if (sctimer) clearTimeout(sctimer);
									setStationary(false);
									setOnlineMode(!onlineMode);
									setWebSearchData([]);
									searchbox.value = "";
									setGlobalIndex(-1);
									setSecondaryIndex(0);
									setSearchKey(searchKey + 1);
									setTimeout(() => {
										if (onlineMode) {
											console.log(prev);
											console.log("scrolling");
											scrollMenu.scrollTo({
												top: prev - 2,
												behavior: "instant",
											});

											scrollMenu.scrollTo({
												top: prev + 2,
												behavior: "smooth",
											});
										}
									}, 1);
								}, 300);
							}}
							style={{
								backgroundColor: switchToggle
									? "#9393934C"
									: "",
							}}>
							<div
								className="bg-[#9393934C] duration-300  h-3/4 aspect-square rounded-full"
								style={{
									backgroundColor: switchToggle
										? "#939393"
										: "",
									marginLeft: switchToggle ? "50%" : "5%",
								}}></div>
						</div>
						<div
							className="bg-post p-1 outline-[#93939300] outline-1 text-bcol duration-300  bg-opacity-0  outline hover:text-bact  rounded-lg aspect-square h-2/3"
							style={{
								opacity: switchToggle ? "1" : "0.25",
							}}>
							{svg.onlineIcon}
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
										setStationary(false);
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
										if (onlineMode && osuDirect) {
											looking.style.height = "3.5vh";
											looking.style.opacity = "1";

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
													looking.style.height = "";
													looking.style.opacity = "";

													let res = data;
													let maps = [];

													for (let i in res.result) {
														let x = JSON.parse(
															res.result[i]
														);

														let lev = [];
														for (let j in x.beatmaps) {
															if (
																x.beatmaps[j]
																	.mode_int !=
																0
															)
																continue;
															lev.push({
																approachRate:
																	x.beatmaps[
																		j
																	].ar,
																circleSize:
																	x.beatmaps[
																		j
																	].cs,
																difficulty:
																	x.beatmaps[
																		j
																	].accuracy,
																hpDrainRate:
																	x.beatmaps[
																		j
																	].drain,
																id: x.beatmaps[
																	j
																].id,
																level: x
																	.beatmaps[j]
																	.version,
																mapper: x.creator,
																source: x.source,
																tags: x.tags,
																setId: x.id,
															});
														}
														lev.sort(
															(a, b) =>
																a.difficulty -
																b.difficulty
														);
														maps.push({
															artist: x.artist,
															backgroundImage:
																x.covers
																	.cover_2x,
															creator: x.creator,
															levels: lev,
															setId: x.id,
															source: x.source,
															tags: x.tags,
															title: x.title,
															songPreview:
																"https:" +
																x.preview_url,
														});
													}
													setWebSearchData(maps);
													setSearchKey(searchKey + 1);
													let ind = -1;
													setGlobalIndex(ind);
													setSecondaryIndex(0);
													fakeClick(0, true);
												});
											return;
										} else if (onlineMode) {
											looking.style.height = "3.5vh";
											looking.style.opacity = "1";
											console.log(
												new URLSearchParams({
													query: searchbox.value,
													limit: 50,
													mode: 0,
													sort: ["bpm", "asc"],
												}).toString()
											);
											fetch(
												uri2 +
													"/api/v2/search?" +
													new URLSearchParams({
														query: searchbox.value,
														limit: 50,
														mode: 0,
														// sort: ["nsfw:desc"],
													}).toString(),
												{
													method: "GET",
													headers: {
														"Content-Type":
															"application/json",
													},
												}
											)
												.then((response) =>
													response.json()
												)
												.then((data) => {
													resetView();
													looking.style.height = "";
													looking.style.opacity = "";

													let res = data;
													let maps = [];
													let ex = [];
													let yx = metaFiles.map(
														(x) => x.setId
													);
													for (let i in res) {
														let x = res[i];
														if (yx.includes(x.id))
															ex.push(x.id);

														let lev = [];
														for (let j in x.beatmaps) {
															if (
																x.beatmaps[j]
																	.mode_int !=
																0
															)
																continue;
															lev.push({
																approachRate:
																	x.beatmaps[
																		j
																	].ar,
																circleSize:
																	x.beatmaps[
																		j
																	].cs,
																difficulty:
																	x.beatmaps[
																		j
																	].accuracy,
																hpDrainRate:
																	x.beatmaps[
																		j
																	].drain,
																id: x.beatmaps[
																	j
																].id,
																level: x
																	.beatmaps[j]
																	.version,
																mapper: x.creator,
																source: x.source,
																tags: x.tags,
																setId: x.id,
															});
														}
														lev.sort(
															(a, b) =>
																a.difficulty -
																b.difficulty
														);
														maps.push({
															artist: x.artist,
															backgroundImage:
																x.covers[
																	"cover@2x"
																],
															creator: x.creator,
															levels: lev,
															setId: x.id,
															source: x.source,
															tags: x.tags,
															title: x.title,
															songPreview:
																"https:" +
																x.preview_url,
														});
													}
													setWebSearchData(maps);
													setExisting(ex);
													setSearchKey(searchKey + 1);
													let ind = -1;
													setGlobalIndex(ind);
													setSecondaryIndex(0);
													fakeClick(0, true);
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
								let ind = -1;
								setSearchKey(0);
								if (onlineMode) setWebSearchData([]);
								else {
									setMetaData(metaFiles);
									if (metaData[0].setId == metaFiles[0].setId)
										return;
								}
								
								setGlobalIndex(ind);
								setSecondaryIndex(0);

								fakeClick(0, true);
								resetView();
							}}></div>
					</div>

					<div
						className="duration-300"
						style={{
							opacity:
								(switchToggle  && webSearchData.length > 0) || (!switchToggle && !onlineMode  && metaData.length > 0)
									? 1
									: 0,
						}}>
						<Preview />
					</div>
				</div>
				<div
					style={{ opacity: start ? 0 : 1 }}
					id="addOSZButton"
					className="w-full flex items-end gap-3 p-3 duration-300 h-full fixed z-20 pointer-events-none">
					<label
						htmlFor="inpp"
						className="pointer-events-auto  bg-opacity-50  aspect-[2.2/1] flex items-center justify-center  bg-post border text-bact border-bcol h-12  text-xs sm:text-sm lg:text-base max-h-[10vh] z-[11]  rounded-md shadow-lg  cursor-pointer   text-center ">
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
					
					<button
						style={{
							opacity: metaFiles.length < 1 ? 1 : 0,
							pointerEvents:
								metaFiles.length < 1 ? "auto" : "none",
						}}
						onClick={(e) => {
							fetch("/demo1.osz")
								.then((res) => res.blob())
								.then((blob) => {
									let file = new File([blob], "demo1.osz", {
										type: "application/octet-stream",
									});
									getFiles([file]);
								});
							fetch("/demo2.osz")
								.then((res) => res.blob())
								.then(async (blob) => {
									let file = new File([blob], "demo1.osz", {
										type: "application/octet-stream",
									});
									getFiles([file], true);
								});

							return;
						}}
						id="loadDemo"
						className=" pointer-events-auto  bg-opacity-50 aspect-[2.2/1]  bg-post border text-bact border-bcol h-12  text-xs sm:text-sm lg:text-base max-h-[10vh]  z-[11] duration-300 rounded-md shadow-lg  cursor-pointer   text-center ">
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
						{svg.loaderIcon}
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
						{svg.exitIcon}
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
						{svg.replayIcon}
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
						{svg.playIcon2}
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
					setId={
						onlineMode
							? webSearchData[globalIndex].setId
							: metaData[globalIndex].setId
					}
					id={
						onlineMode
							? webSearchData[globalIndex].levels[secondaryIndex]
									.id
							: metaData[globalIndex].levels[secondaryIndex].id
					}
					setStart={setStart}
					attempts={attempts}
					online={tempOnline}
				/>
			) : (
				<></>
			)}
			<div
				id="messagebox"
				className="text-bhov p-[0.5vh] fixed bottom-0 text-[1.5vh] right-0 duration-300 flex flex-col justify-center item  bg-post  bg-opacity-50  h-fit  w-[21vh]  w-fit  overflow-clip rounded-tl-md">
				<div
					id="looking"
					className="duration-300 opacity-0 overflow-hidden h-0 flex items-center">
					<div className="h-[3.5vh] scale-[60%]">
						{svg.loaderIcon2}
					</div>{" "}
					Looking for beatmaps
				</div>
				<div
					id="fetchingSong"
					className=" flex items-center opacity-0 overflow-hidden duration-300  h-0">
					<div className=" h-[3.5vh] scale-[60%]">
						{svg.loaderIcon2}
					</div>{" "}
					Fetching preview audio
				</div>
				<div
					id="fetchingSet"
					className=" flex items-center opacity-0 overflow-hidden duration-300  h-0">
					<div className=" h-[3.5vh] scale-[60%]">
						{svg.loaderIcon2}
					</div>{" "}
					Downloading
					<div id="unzipxCounter" className="ml-[1vh]">
						{"(" + downloadHead + "/" + downloadQueue.length + ")"}
					</div>
				</div>
				<div
					id="unzippingSet"
					className=" flex items-center opacity-0 overflow-hidden duration-300  h-0">
					<div className=" h-[3.5vh] scale-[60%]">
						{svg.loaderIcon2}
					</div>{" "}
					Unzipping
					<div id="unzipxCounter" className="ml-[1vh]">
						{"(" + unzipCounter + "/" + unzipTotal + ")"}
					</div>
				</div>
				<div
					id="setSaved"
					className=" flex items-center opacity-0  text-colors-green overflow-hidden duration-300  h-0">
					<div className=" h-[3.5vh] aspect-square  scale-[60%]">
						{svg.tickIcon}
					</div>{" "}
					Saved Successfully
				</div>
				<div
					id="waitDC"
					className=" flex items-center opacity-0   overflow-hidden duration-300  h-0">
					<div className=" h-[3.5vh]  scale-[75%] text-colors-red aspect-square">
						{svg.crossIcon}
					</div>{" "}
					Downloader Busy
				</div>
				<div
					id="clickToUnmute"
					className=" flex items-center opacity- 0 ml-[1vh]   overflow-hidden duration-300  h-[3.5vh]">
					
					Click anywhere to unmute
				</div>
				
				<div
					onLoad={getFps()}
					className=" flex items-center opacity -0 px-[1vh]  w-full overflow-hidden duration-300  h -0">
					<div className="max-w-1/2 w-1/2 flex justify-start">
						{"Latency:"}
						<div className="ml-1" id="lat"></div>ms
					</div>
					<div className="max-w-1/2 w-1/2 flex justify-end">
						{"FPS:"}
						<div className="ml-1" id="fps"></div>
					</div>
				</div>
			</div>
		</>
	);
}

export default SongSelectionMenu;
