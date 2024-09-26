import JSZip from "jszip";
import Preview from "./Components/Preview";
import { useEffect, useState } from "react";
import MiniSearch from "minisearch";
import utf8 from "utf8";
import {
	fakeClick as scrollListTo,
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
	setBeatmapPreviewData,
	useWindowDimensions,
} from "./Utility/Utils";
import { svg } from "./Utility/VectorGraphics";
import PlayArea from "./PlayArea";
import { uri, uri2 } from "./App";
import MusicPlayer from "./Components/MusicPlayer";
import MessageBox from "./Components/MessageBox";
import PauseScreen from "./PauseScreen";
import LoadScreen from "./LoadScreen";
import Toggle from "./Components/Toggle";
import SettingsScreen from "./SettingsScreen";
import { settings } from "./SettingsValues";
import Confirm from "./Confirm";
let typeTimeout = null;
let scrollTimeout = null;
let settingScrollTimeout = null;
let scIndTimer = null;
let settingTimer = null;
let playLastActiveSongTimeout = null;
let offlineDBSearch = null;
function SongSelectionMenu() {
	const { height, width } = useWindowDimensions()
	let elementHeight = 80;
	let loadLimit = parseInt(height / elementHeight);
	if (loadLimit < 6) loadLimit = 6;
	const [metaData, setMetaData] = useState([]);
	const [metaFiles, setMetaFiles] = useState([]);
	const [webSearchData, setWebSearchData] = useState([]);
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
	const [savedScrollPosition, setSavedScrollPosition] = useState(-1);
	const [osuDirect, setOsuDirect] = useState(!true);
	const [exisiting, setExisting] = useState([]);
	const [tempOnline, setTempOnline] = useState(false);
	const [stationary, setStationary] = useState(false);
	const [switchToggle, setSwitchToggle] = useState(false);
	const [unzipHead, setUnzipHead] = useState(0);
	const [unzipQueueLength, setUnzipQueueLength] = useState(0);
	const [downloadHead, setDownloadHead] = useState(0);
	const [activeDownload, setActiveDownload] = useState(false);
	const [downloadQueue, setDownloadQueue] = useState([]);
	const [sctop, setSctop] = useState(0);
	const [settingsToggle, setSettingsToggle] = useState(false);
	const [updateSetting, setUpdateSettings] = useState(0);
	const [settingScrollIndex, setSettingScrollIndex] = useState(0);
	const [fun, setFun] = useState(null);
	async function getFiles(files, mode = false) {
		setUnzipQueueLength((prev) => prev + files.length);
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

		let initLen = metaFiles.length;
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
						offlineDBSearch.add(setMeta);
					} catch (e) {}

					if (mode) return;
					else if (scrollMenu.style.opacity == 1) {
						scrollListTo(Math.max(metaData.length, 1), false);
						setSearchKey(searchKey + 1);
					} else {
					}
				};
			});
		}
		await setData();
		setUnzipHead((prev) => prev + 1);
		if (initLen == 0) {
			scrollListTo(0, true);
		}
	}
	function keyaction(e) {
		if (previewSearch.style.opacity == 1) {
			if (!start && e.key == "Escape") {
				if (document.getElementById("resetConfirm")) {
					document.getElementById("resetConfirm").click();

					return;
				} else if (document.getElementById("settingsPage")) {
					stb.click();
					return;
				} else {
					searchbox.value = "";
					searchbox.blur();
					resetButton.click();
					setSearchKey(searchKey + 1);
					return;
				}
			}
			if (!start) {
				if (e.altKey && e.key == "o") {
					document.getElementById("onlineModeSwitch").click();
				} else if (e.altKey && e.key == "s") {
					stb.click();
				} else if (e.altKey && e.key == "x") {
					document.getElementById("deleteModeButton").click();
				} else if (e.altKey && e.key == "m") {
					music.muted = !music.muted;
				} else if (e.altKey && e.key == "p") {
					music.paused ? music.play() : music.pause();
				}

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
			playSong("/", 0, 0, "-", true);
		} catch (e) {}

		try {
			setPreviewImage(0, "", 0, true);
		} catch (e) {}
	}
	function searchBeatMaps(e) {
		{
			if (typeTimeout !== null) {
				clearTimeout(typeTimeout);
			}
			typeTimeout = setTimeout(() => {
				setStationary(false);
				if (offlineDBSearch && !onlineMode == null) {
					return;
				} else if (e.target.value == "" && onlineMode) {
					setWebSearchData([]);
					resetView();
					searchbox.value = "";
					setGlobalIndex(-1);
					setSecondaryIndex(0);
				} else if (e.target.value == "" && !onlineMode) {
					setMetaData(metaFiles);
					let ind = -1;
					try {
						if (metaData[0].setId == metaFiles[0].setId) ind = 0;
					} catch (e) {}
					setGlobalIndex(ind);
					setSecondaryIndex(0);
					setSearchKey(0);
					scrollListTo(0, true);
				} else if (onlineMode && osuDirect) {
					looking.style.height = "3.5vh";
					looking.style.opacity = "1";
					fetch(uri + "/search", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							query: e.target.value,
						}),
					})
						.then((response) => response.json())
						.then((data) => {
							resetView();
							looking.style.height = "";
							looking.style.opacity = "";
							let res = data;
							let maps = [];
							for (let i in res.result) {
								let x = JSON.parse(res.result[i]);

								let lev = [];
								for (let j in x.beatmaps) {
									if (x.beatmaps[j].mode_int != 0) continue;
									lev.push({
										approachRate: x.beatmaps[j].ar,
										circleSize: x.beatmaps[j].cs,
										difficulty: x.beatmaps[j].accuracy,
										hpDrainRate: x.beatmaps[j].drain,
										id: x.beatmaps[j].id,
										level: x.beatmaps[j].version,
										mapper: x.creator,
										source: x.source,
										tags: x.tags,
										setId: x.id,
									});
								}
								lev.sort((a, b) => a.difficulty - b.difficulty);
								maps.push({
									artist: x.artist,
									backgroundImage: x.covers.cover_2x,
									creator: x.creator,
									levels: lev,
									setId: x.id,
									source: x.source,
									tags: x.tags,
									title: x.title,
									songPreview: "https:" + x.preview_url,
								});
							}
							setWebSearchData(maps);
							setSearchKey(searchKey + 1);
							let ind = -1;
							setGlobalIndex(ind);
							setSecondaryIndex(0);
							scrollListTo(0, true);
						});
				} else if (onlineMode) {
					looking.style.height = "3.5vh";
					looking.style.opacity = "1";
					// console.log(
					// 	new URLSearchParams({
					// 		query: searchbox.value,
					// 		limit: 50,
					// 		mode: 0,
					// 		sort: ["bpm", "asc"],
					// 	}).toString()
					// );
					fetch(
						uri2 +
							"/api/v2/search?" +
							new URLSearchParams({
								query: searchbox.value,
								limit: 50,
								mode: 0 /* sort: ["nsfw:desc"],*/,
							}),
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						}
					)
						.then((response) => response.json())
						.then((data) => {
							resetView();
							looking.style.height = "";
							looking.style.opacity = "";
							let maps = [];
							let exisiting = [];
							let offlineSetIds = metaFiles.map((x) => x.setId);
							for (let i in data) {
								let beatMapSet = data[i];
								if (offlineSetIds.includes(beatMapSet.id))
									exisiting.push(beatMapSet.id);
								let beatMaps = [];
								for (let j in beatMapSet.beatmaps) {
									if (beatMapSet.beatmaps[j].mode_int != 0)
										continue;
									beatMaps.push({
										approachRate: beatMapSet.beatmaps[j].ar,
										circleSize: beatMapSet.beatmaps[j].cs,
										difficulty:
											beatMapSet.beatmaps[j].accuracy,
										hpDrainRate:
											beatMapSet.beatmaps[j].drain,
										id: beatMapSet.beatmaps[j].id,
										level: beatMapSet.beatmaps[j].version,
										mapper: beatMapSet.creator,
										source: beatMapSet.source,
										tags: beatMapSet.tags,
										setId: beatMapSet.id,
									});
								}
								beatMaps.sort(
									(a, b) => a.difficulty - b.difficulty
								);
								maps.push({
									artist: beatMapSet.artist,
									backgroundImage:
										beatMapSet.covers["cover@2x"],
									creator: beatMapSet.creator,
									levels: beatMaps,
									setId: beatMapSet.id,
									source: beatMapSet.source,
									tags: beatMapSet.tags,
									title: beatMapSet.title,
									songPreview:
										"https:" + beatMapSet.preview_url,
								});
							}
							setWebSearchData(maps);
							setExisting(exisiting);
							setSearchKey(searchKey + 1);
							setGlobalIndex(-1);
							setSecondaryIndex(0);
							scrollListTo(0, true);
						});
				} else {
					let offlineDBSearchResult = offlineDBSearch.search(
						e.target.value
					);
					let temp = [];
					for (let i in offlineDBSearchResult) {
						let val = metaFiles.find(
							(x) => x.setId == offlineDBSearchResult[i].setId
						);
						if (val != undefined && val != null) temp.push(val);
					}
					setMetaData(temp);
					setSearchKey(searchKey + 1);
					let ind = -1;
					try {
						if (metaData[0].setId == temp[0].setId) ind = 0;
					} catch {}
					setGlobalIndex(ind);
					setSecondaryIndex(0);
					scrollListTo(0, true);
				}
			}, 1000);
		}
	}
	function scrollHandler() {
		setSctop(scrollMenu.scrollTop);
		let select = onlineMode ? webSearchData : metaData;
		let centerIndex = Math.min(
			parseInt(scrollMenu.scrollTop / elementHeight),
			select.length - 1
		);
		if (scIndTimer) clearTimeout(scIndTimer);
		scIndTimer = setTimeout(() => {
			setScrollIndex(centerIndex);
			scIndTimer = null;
		}, 50);
		if (
			(onlineMode && webSearchData.length < 1) ||
			(!onlineMode && metaData.length < 1)
		)
			return;
		scrollMenu.style.scrollSnapType = "none";
		scrollMenu.style.marginTop = "0px";
		setStationary(false);
		if (scrollTimeout !== null) {
			clearTimeout(scrollTimeout);
		}

		scrollTimeout = setTimeout(async function () {
			setStationary(true);

			scrollTimeout = null;
			let centerIndex = Math.min(
				parseInt(scrollMenu.scrollTop / elementHeight),
				select.length - 1
			);
			if (!deleteMode)
				scrollMenu.style.marginTop =
					-Math.min(
						0.25 * height,
						select[centerIndex].levels.length * 32
					) + "px";

			if (centerIndex != globalIndex) {
				let valueBeatMap = select[centerIndex];
				let defaultLevel = valueBeatMap.levels[0];
				playSong(
					onlineMode ? valueBeatMap.songPreview : valueBeatMap.setId,
					0,
					onlineMode ? 0 : defaultLevel.previewTime,
					valueBeatMap.title,
					onlineMode
				);
				setPreviewImage(
					valueBeatMap.setId,
					onlineMode
						? valueBeatMap.backgroundImage
						: defaultLevel.backgroundImage,
					0,
					onlineMode
				);
				defaultLevel.creator = valueBeatMap.creator;
				try {
					defaultLevel.source = onlineMode
						? valueBeatMap.source
						: utf8.decode(valueBeatMap.source);
				} catch (e) {}
				try {
					defaultLevel.tags = onlineMode
						? valueBeatMap.tags
						: utf8.decode(valueBeatMap.tags);
				} catch (e) {}
				defaultLevel.title = valueBeatMap.title;
				defaultLevel.artist = valueBeatMap.artist;
				setBeatmapPreviewData(defaultLevel);
				setGlobalIndex(centerIndex);
				setSecondaryIndex(0);
				setPrevMusic([
					onlineMode ? valueBeatMap.songPreview : valueBeatMap.setId,
					0,
					onlineMode ? 0 : defaultLevel.previewTime,
					valueBeatMap.title,
					onlineMode,
				]);
			}
		}, 1200);
	}
	function toggleDeleteMode() {
		let dm = deleteMode;
		scrollMenu.style.scrollSnapType = "none";
		scrollMenu.style.marginTop = "0px";
		dm = !dm;
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
	}
	function toggleOnlineMode() {
		let prev = savedScrollPosition;
		scrollTimeout = null;
		scrollMenu.style.opacity = 0;
		setSavedScrollPosition(scrollMenu.scrollTop);
		resetView();
		setSwitchToggle(!onlineMode);
		setTimeout(() => {
			if (scrollTimeout) clearTimeout(scrollTimeout);
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
	}
	useEffect(() => {
		if (!focus) return;
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
						offlineDBSearch = new MiniSearch({
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
						offlineDBSearch.addAll(result);
						scrollListTo(0, true);
						//setTimeout(() => {}, 2000);
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
						if (
							settings.Maintainance["Clear Temp Storage"].value ==
							0
						) {
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
									objectStore = db.createObjectStore(
										"Assets",
										{
											keyPath: "setId",
										}
									);
									objectStore = db.createObjectStore("Meta", {
										keyPath: "setId",
									});
									objectStore = db.createObjectStore(
										"Preview",
										{
											keyPath: "setId",
										}
									);
								};
							};
						} else {
							let result = event.target.result.sort((a, b) =>
								a.title.localeCompare(b.title)
							);
							setTempFiles(result);
						}
					}
				};
		};
	}, [focus]);
	useEffect(() => {
		if (!start && prevMusic.length > 0) {
			playLastActiveSongTimeout = setTimeout(() => {
				playSong(
					prevMusic[0],
					prevMusic[1],
					prevMusic[2],
					prevMusic[3],
					prevMusic[4]
				);
			}, 100);
		} else if (playLastActiveSongTimeout != null) {
			clearTimeout(playLastActiveSongTimeout);
		}
	}, [start]);
	useEffect(() => {
		if (unzipHead == unzipQueueLength && unzipQueueLength > 0) {
			unzippingSet.style.height = "";
			unzippingSet.style.opacity = "";
			setSaved.style.opacity = "1";
			setSaved.style.height = "3.5vh";
			setTimeout(() => {
				setSaved.style.opacity = "0";
				setSaved.style.height = "0vh";
				setUnzipHead(0);
				setUnzipQueueLength(0);
			}, 1000);
		} else if (unzipQueueLength > 0) {
			unzippingSet.style.height = "3.5vh";
			unzippingSet.style.opacity = "1";
		}
	}, [unzipHead, unzipQueueLength]);
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
					setUnzipQueueLength((prev) => prev + 1);
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
	// if (
	// 	!settingsVal.showBanners &&
	// 	metaData.length > 0 &&
	// 	metaData[0].backgroundImage != ""
	// ) {
	// 	let temp = metaData.map((x) => {
	// 		x.backgroundImage = "";
	// 		return x;
	// 	});
	// 	let temp2 = metaFiles.map((x) => {
	// 		x.backgroundImage = "";
	// 		return x;
	// 	});
	// 	setMetaData(temp);
	// 	setMetaFiles(temp2);
	// }
	if (start) {
		backgroundImage.style.filter =
			"blur(" +
			settings.Gameplay["Background Blur"].value / 5 +
			"px) brightness(" +
			(1 - settings.Gameplay["Background Dim"].value / 100) +
			")";
	} else {
		if (settings.User_Interface.Background.value != 0) {
			backgroundImage.style.filter = "blur(0px) brightness(0.5)";
		} else {
			backgroundImage.style.filter = "blur(12px) brightness(0.5)";
		}
	}
	let sct = 0;
	try {
		sct = scrollMenu.scrollTop / elementHeight;
	} catch (e) {}
	let rX = height * 3;
	let rY = height / 2;
	function onImageLoad() {
		console.log(event);
	}
	let list = (onlineMode ? webSearchData : metaData).map((element, index) => {
		return (
			<div
				key={"element" + (onlineMode ? "2" : "") + element.setId}
				id={"element" + (onlineMode ? "2" : "") + index}
				style={{
					height:
						(scrollIndex == index &&
						stationary &&
						(!deleteMode || onlineMode)
							? 96 + element.levels.length * 68
							: "80") + "px",

					transitionBehavior: "allow-discrete",
					transition: deleteMode
						? ""
						: "margin-right 0.3s , height 0.3s,  background-color 0.3s, transform 0.3s",
					offsetRotate: "0deg",
					offsetDistance: deleteMode
						? "50%"
						: "calc(50% - " + (sct - index) * 20 + "px)",
					offsetAnchor: "0% 0%",
					offsetPath:
						"path('m " +
						rX * 2 +
						" 0 a " +
						rX +
						" " +
						rY +
						" 0 1 0 0 5')",
					transform:
						scrollIndex == index
							? "translateX(-5%) translateY(0%)"
							: deleteMode
							? "translateX(-3%) translateY(0%)"
							: "",
					marginBottom: deleteMode ? "2vh" : "",
					backgroundColor: !settings.User_Interface.UI_BackDrop.value
						? "#252525"
						: "#2525254C",
						
				}}
				className={
					"bg-post   outline fade-in outline-1  outline-bcol duration-300 w-[45vw] rounded-md text-gray-300 max-h-[50vh] shadow-lg nons snap-cetner overflow-hidden "
				}>
				{Math.abs(scrollIndex - index) < loadLimit * 1.2 ||
				onlineMode ? (
					<>
						<div
							onClick={(e) => {
								if (e.target != e.currentTarget) return;

								scrollListTo(index, false);
							}}
							className=" w-full h-20  flex fade-in  outline outline-1    rounded-t-lg"
							style={{
								backgroundImage: settings.User_Interface
									.Show_Banners.value
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
								<div
									className="h-full -ml-3 -mr-[25vw]  min-w-[25vw] backdrop -invert duration-300"
									style={{
										background:
											"linear-gradient(to right ,#1b1b1b,#1b1b1b00)",
									}}></div>
								{onlineMode ? (
									<div
										id={"download" + index}
										className="h-10 absolute min-w-fit duration-300 flex items-center justify-center overflow-hidden  text-bcol hover:text-colors-red aspect-square"
										onClick={async (e) => {
											e.preventDefault();
											let y = tempFiles.filter(
												(x) => x.setId == element.setId
											);
											if (y.length > 0) {
												y = y[0];
												setUnzipQueueLength(
													(prev) => prev + 1
												);
												let assets = null;
												let osuFiles = null;
												let setMeta = null;
												let preview = null;
												function getData() {
													return new Promise(
														(resolve, reject) => {
															const request =
																indexedDB.open(
																	"tempWebsuStorage",
																	2
																);
															request.onsuccess =
																function (
																	event
																) {
																	const db =
																		event
																			.target
																			.result;
																	const transaction =
																		db.transaction(
																			[
																				"Assets",
																				"Files",
																				"Meta",
																				"Preview",
																			]
																		);
																	transaction
																		.objectStore(
																			"Assets"
																		)
																		.get(
																			element.setId
																		).onsuccess =
																		function (
																			event
																		) {
																			assets =
																				event
																					.target
																					.result;
																		};
																	transaction
																		.objectStore(
																			"Files"
																		)
																		.get(
																			element.setId
																		).onsuccess =
																		function (
																			event
																		) {
																			osuFiles =
																				event
																					.target
																					.result;
																		};
																	transaction
																		.objectStore(
																			"Meta"
																		)
																		.get(
																			element.setId
																		).onsuccess =
																		function (
																			event
																		) {
																			setMeta =
																				event
																					.target
																					.result;
																		};
																	transaction
																		.objectStore(
																			"Preview"
																		)
																		.get(
																			element.setId
																		).onsuccess =
																		function (
																			event
																		) {
																			preview =
																				event
																					.target
																					.result;
																		};
																	transaction.oncomplete =
																		function () {
																			resolve();
																		};
																};
														}
													);
												}
												await getData();
												function setData() {
													return new Promise(
														(resolve, reject) => {
															const request =
																indexedDB.open(
																	"websuStorage",
																	2
																);
															request.onsuccess =
																function (
																	event
																) {
																	const db =
																		event
																			.target
																			.result;
																	const transaction =
																		db.transaction(
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
																	try {
																		const request =
																			objectStore.put(
																				assets
																			);
																	} catch (e) {
																		const request =
																			objectStore.add(
																				assets
																			);
																	}
																	objectStore =
																		transaction.objectStore(
																			"Files"
																		);
																	try {
																		const request =
																			objectStore.put(
																				osuFiles
																			);
																	} catch (e) {
																		const request =
																			objectStore.add(
																				osuFiles
																			);
																	}
																	objectStore =
																		transaction.objectStore(
																			"Meta"
																		);
																	try {
																		const request =
																			objectStore.put(
																				setMeta
																			);
																	} catch (e) {
																		const request =
																			objectStore.add(
																				setMeta
																			);
																	}
																	objectStore =
																		transaction.objectStore(
																			"Preview"
																		);
																	try {
																		const request =
																			objectStore.put(
																				preview
																			);
																	} catch (e) {
																		const request =
																			objectStore.add(
																				preview
																			);
																	}
																	transaction.oncomplete =
																		function () {
																			resolve();
																		};
																	if (
																		webSearchData.length >
																		0
																	)
																		exisiting.push(
																			setMeta.setId
																		);
																	setMeta.id =
																		metaData.length;
																	setMetaData(
																		(
																			prev
																		) => [
																			...prev.filter(
																				(
																					x
																				) =>
																					x.setId !=
																					setMeta.setId
																			),
																			setMeta,
																		]
																	);
																	setMetaFiles(
																		(
																			prev
																		) => [
																			...prev.filter(
																				(
																					x
																				) =>
																					x.setId !=
																					setMeta.setId
																			),
																			setMeta,
																		]
																	);
																	try {
																		offlineDBSearch.add(
																			setMeta
																		);
																	} catch (e) {}
																};
														}
													);
												}
												await setData();
												setUnzipHead(
													(prev) => prev + 1
												);
											} else
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
								<div className="flex max-w-[calc(45vw-60px)] absolute mt-3 flex-wrap  duration-300  items-center py-2"
								style={{
									left:onlineMode?"60px":""
								}}
								>
									<div className="leading-[40px] lexend h- overflow-hidden w-full min-h-fit   whitespace-nowrap text-ellipsis font-semibold text-[30px] pointer-events-none  self-start text-[#ccc] ">
										{element.title}
									</div>
									<div className="flex leading-[20px] w-full  h-1/2  whitespace-nowrap text-ellipsis  self-start ml-2 text-[#bbb] mb-[20px]  pointer-events-none text-[18px]">
										{element.artist +
											" - " +
											element.creator}
									</div>
								</div>
								<div
									id={"delete" + index}
									className="h-1/2 min-w-fit duration-300 text-bcol hover:text-colors-red aspect-square"
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
									height: element.levels.length * 68 + "px",
								}}>
								{element.levels.map((x, index2) => (
									<div
										key={"sub" + index + " " + index2}
										id={"sub" + index + " " + index2}
										className=" flex flex-col  justify-evenly rounded-md p-1 px-3  duration-300 w-full  text-[#eee] mb-2 h-[60px]"
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
													: settings.User_Interface
															.UI_BackDrop.value
													? "#1b1b1b4C"
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
	let skewDeg = 8;
	return (
		<>
			{" "}
			<div
				className="fixed   w-[60vw] duration-300 h-1/2 top-1/4 -left-0 bg-opacity-40 bg-black"
				style={{
					transform:
						"skew(-" +
						skewDeg +
						"deg,-" +
						skewDeg +
						"deg) rotate(" +
						skewDeg +
						"deg) translateY(-50%) translateX(-20%)",
						opacity:
							start 
								? 0
								: 1,
				}}></div>
			<div
				className="fixed w-[60vw] h-1/2 duration-300 top-1/4 -left-0 bg-opacity-40 bg-black"
				style={{
					transform:
						"skew(" +
						skewDeg +
						"deg," +
						skewDeg +
						"deg) rotate(-" +
						skewDeg +
						"deg) translateY(50%)  translateX(-20%)",
						opacity:
							start 
								? 0
								: 1,
				}}></div>
			<div id="screen" className="fade-in">
				<div
					className="duration-300 lexend fixed overflow-hidden  pointer-events-none  text-3xl font-bold w-1/2 right-0 h-full  flex flex-col items-center  justify-center text-bact "
					style={{
						opacity:
							!onlineMode && !switchToggle && metaData.length < 1
								? "0.5"
								: "0",
					}}>
					<div>
						{metaFiles.length < 1 ? (
							<>
								<label
									htmlFor="inpp"
									className=" hover:text-white duration-300 pointer-events-auto">
									Upload
								</label>{" "}
								a beatmap set,
							</>
						) : (
							<>No beatmaps found, </>
						)}
					</div>
					<div>
						{metaFiles.length < 1 ? (
							<>
								<label
									htmlFor="loadDemo"
									className=" hover:text-white duration-300 pointer-events-auto">
									load demo
								</label>{" "}
								, or{" "}
							</>
						) : (
							<>try using different keywords, or </>
						)}
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
					className="duration-300 lexend fixed overflow-hidden  pointer-events-none  text-3xl font-bold w-1/2 right-0 h-full  flex flex-col items-center  justify-center text-bact "
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
					className=" duration-300 fixed overflow-y-scroll z-0 select-none  scroll-smooth overflow-x-hidden right-0  bg -post  pl-4   w-[50vw] items-end justify-end fade-in  grid   h-[150%] pt-[50vh]    "
					onScroll={scrollHandler}
					style={{
						scrollBehavior: "smooth",
						opacity:
							start ||
							(settingsToggle && width < 1024)
								? 0
								: 1,
						pointerEvents:
							start ||
							(metaData.length < 1 && webSearchData.length < 1) ||
							(settingsToggle && width < 1024)
								? "none"
								: "auto",
							marginRight:settingsToggle && (width/2<1024)?-(1024-width/2):""
						
					}}>
					{list}
					<div
						id="emptyy2"
						className=" h-[100vh]"
						onDragCapture={(e) => {
							e.preventDefault();
						}}></div>
					<div
						className="h-[2vh] fixed duration-100 -translate-x-1/2  left-[53vw]"
						style={{
							opacity: stationary ? 0 : 0,
							top:
								"calc(50% + " +
								(scrollIndex * elementHeight -
									sct * elementHeight +
									elementHeight / 3) +
								"px)",
						}}>
						{svg.playIcon}
					</div>
				</div>

				<div
					style={{
						opacity: start ? 0 : 1,
					}}
					id="previewSearch"
					className="w-full h-full flex pointer-events-none flex-col   fixed ">
					<div
						style={{
							pointerEvents: start ? "none" : "auto",
							backgroundColor: !settings.User_Interface
								.UI_BackDrop.value
								? "#252525"
								: "",
							backdropFilter: !settings.User_Interface.UI_BackDrop
								.value
								? "blur(0px)"
								: "",
							WebkitBackdropFilter: !settings.User_Interface
								.UI_BackDrop.value
								? " blur(0px) "
								: "",
						}}
						className="bg-post flex items-center justify-end gap-2 pr-2 duration-300 bg-opacity-50 z-20   border-bcol h-[60px]  border-b-2  backdrop-blur-md   w-full  top-0 left-0  ">
						<div className="h-full flex  w-full self-start">
							<div className="h-full  -mr-3 aspect-square group text-bcol hover:text-white duration-300 flex flex-wrap items-center justify-center">
								<div
									id="stb"
									className="h-full flex items-center justify-center  aspect-square"
									onClick={() => {
										if (settingTimer) return;
										if (settingsToggle) {
											settingsPage.style.transform =
												"translateX(-100%)";
											settingsPage.style.opacity = 0;
											if (
												(metaFiles.length > 0 &&
													!onlineMode) ||
												(webSearchData.length > 0 &&
													onlineMode)
											)
												previewContainer.style.opacity = 1;
											scrollMenu.style.marginRight=""
											settingTimer = setTimeout(() => {
												setSettingsToggle(
													!settingsToggle
												);
												settingTimer = null;
											}, 300);
										} else {
											setSettingsToggle(!settingsToggle);
											settingTimer = setTimeout(() => {
												settingTimer = null;
											}, 300);
										}
									}}>
									<div className="h-1/2 -mt-[0.5vh]  aspect-square">
										{svg.settingsIcon}
									</div>
								</div>
								<div className="absolute delay-0 group-hover:delay-500 text-bcol group-hover:text-white opacity-0 duration-300 pointer-events-none transition-opacity group-hover:opacity-100 ">
									<div className="h-full w-full ml-1 mt-28 bg-opacity-50 bg-post pb-[6px]  rounded-md pt-1 min-w-fit flex">
										Settings
									</div>
								</div>
							</div>
							<MusicPlayer />
						</div>

						<div
							className="h-full aspect-[3/1] justify-end duration-300 flex"
							style={{
								opacity: !switchToggle ? "1" : "0",
								pointerEvents: !switchToggle ? "all" : "none",
							}}>
							<div
								className="h-full  -mr-3 aspect-square group text-bcol hover:text-white duration-300 flex flex-wrap items-center justify-center"
								style={{
									opacity: metaFiles.length < 1 ? "1" : "0",
									pointerEvents:
										metaFiles.length < 1 ? "all" : "none",
								}}>
								<div className="w-2/5 h-fit  mt-[0.5vh] ">
									<label htmlFor="loadDemo">
										{svg.demoIcon}
									</label>
								</div>
								<button
									id="loadDemo"
									className="hidden"
									onClick={(e) => {
										setDownloadQueue((prev) => [
											...prev,
											[1451291, false],
											[1974878, false],
										]);

										return;
									}}></button>
								<div className="absolute delay-0 group-hover:delay-500 text-bcol opacity-0 duration-300 pointer-events-none transition-opacity group-hover:opacity-100 ">
									<div className="h-full w-full  mt-28 bg-opacity-50 bg-post pb-[6px]  rounded-md p-1 min-w-fit flex">
										Load Demo
									</div>
								</div>
							</div>
							<div className="h-full -mr-3 aspect-square group text-bcol hover:text-white duration-300 flex flex-wrap items-center justify-center">
								<div
									onClick={toggleDeleteMode}
									id="deleteModeButton"
									className="bg-post p-1 outline-[#93939300] outline-1 text-bcol duration-300  bg-opacity-0  outline hover:text-white  rounded-lg aspect-square h-2/3"
									style={{
										color: deleteMode ? "#b3b3b3" : "",
										outlineColor: deleteMode
											? "#939393"
											: "",
										backgroundColor: deleteMode
											? "#2525254C"
											: "",
									}}>
									{svg.deleteIcon}
								</div>
								<div className="absolute delay-0 group-hover:delay-500 opacity-0 duration-300 pointer-events-none transition-opacity group-hover:opacity-100 ">
									<div className="h-full w-full mt-28 bg-opacity-50 bg-post pb-[6px]  rounded-md p-1 min-w-fit flex">
										Delete Mode
									</div>
								</div>
							</div>
							<div className="h-full -mr-[6px] group aspect-square text-bcol hover:text-white duration-300 flex flex-wrap items-center justify-center">
								<div className="w-2/5 ">
									<label htmlFor="inpp">
										{svg.uploadIcon}
									</label>
								</div>
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
								<div className="absolute delay-0 group-hover:delay-500 opacity-0 duration-300 pointer-events-none transition-opacity group-hover:opacity-100 ">
									<div className="h-full w-full mt-28 bg-opacity-50 bg-post pb-[6px]  rounded-md p-1 min-w-fit flex">
										Upload Beatmap
									</div>
								</div>
							</div>
						</div>
						<div
							className=" p-1 text-bcol duration-300  aspect-square h-2/3"
							style={{
								opacity: !switchToggle ? "1" : "0.25",
							}}>
							{svg.offlineIcon}
						</div>
						<div className="h-full w-10 group aspect-square text-bcol hover:text-white duration-300 flex flex-wrap items-center justify-center">
							<Toggle
								value={switchToggle}
								onClick={toggleOnlineMode}
								mode={true}
								title="onlineModeSwitch"
							/>
							<div className="absolute delay-0 group-hover:delay-500 opacity-0 duration-300 pointer-events-none transition-opacity group-hover:opacity-100 ">
								<div className="h-full w-full mt-28 bg-opacity-50 bg-post pb-[6px]  rounded-md p-1 min-w-fit flex">
									Go {switchToggle ? "Offline" : "Online"}
								</div>
							</div>
						</div>
						<div
							className=" p-1  text-bcol duration-300 aspect-square h-2/3"
							style={{
								opacity: switchToggle ? "1" : "0.25",
							}}>
							{svg.onlineIcon}
						</div>

						<div className="bg-post p-1 pl-2 outline-bcol outline-1 flex items-center   outline bg-opacity-30 rounded-lg w-[20vw] min-w-14 h-2/3 ">
							<input
								id="searchbox"
								placeholder="Search"
								onChange={searchBeatMaps}
								type="text"
								className="  text-xs sm:text-sm lg:text-base -mt-[1Px] w-full  text-slate-200 bg-white bg-opacity-0 border-none outline-none focus:border-none rounded-md"
							/>
						</div>
						<div id="playTime" className="text-bact">00:00:00
						</div>
						<div
							id="resetButton"
							className="w-16 h-16 bg-black hidden"
							onClick={() => {
								let ind = -1;

								if (onlineMode) setWebSearchData([]);
								else {
									setMetaData(metaFiles);

									if (
										metaData.length > 0 &&
										metaData[0].setId == metaFiles[0].setId
									)
										return;
								}
								setStationary(false);
								setSearchKey(0);
								setGlobalIndex(ind);
								setSecondaryIndex(0);
								setTimeout(() => {
									console.log("doneee");
									scrollMenu.scrollTo({
										top: 4,
										behavior: "instant",
									});
									scrollMenu.scrollTo({
										top: 2,
										behavior: "smooth",
									});
								}, 10);
								resetView();
							}}></div>
					</div>

					<div
						className="duration-300"
						id="previewContainer"
						style={{
							opacity:
								(switchToggle && webSearchData.length > 0) ||
								(!switchToggle &&
									!onlineMode &&
									metaData.length > 0)
									? !settingsToggle
										? 1
										: 0
									: 0,
						}}>
						<Preview
							backdrop={settings.User_Interface.UI_BackDrop.value}
						/>
					</div>
					{settingsToggle ? (
						<SettingsScreen
							setUpdateSettings={setUpdateSettings}
							setFun={setFun}
						/>
					) : (
						<></>
					)}
				</div>

				<LoadScreen start={start} />
				<PauseScreen setStart={setStart} setAttempts={setAttempts} />
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
			<MessageBox
				downloadHead={downloadHead}
				downloadQueue={downloadQueue}
				unzipCounter={unzipHead}
				unzipTotal={unzipQueueLength}
				showFps={settings.User_Interface.Show_FPS.value}
			/>
			{fun ? <Confirm fun={fun} setFun={setFun} /> : <></>}
		</>
	);
}

export default SongSelectionMenu;
