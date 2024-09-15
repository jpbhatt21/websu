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
} from "./Utils";
import PlayArea from "./PlayArea";
let typetimer = null;
let sctimer = null;
let musicTimer = null;
let minis = null;
let defaultElementClass =
	"bg-blank outline fade-in outline-1 outline-bcol duration-300 w-[45vw] rounded-md text-gray-300 max-h-[50vh] shadow-lg nons snap-cetner overflow-hidden ";
function SongSelectionMenu() {
	function getFiles(files,mode=false) {
		for (let i = 0; i < files.length; i++) {
			try {
				if (files[i].name.includes(".osz")) {
					getOszFileToUnzip(files[i], i,mode);
				} else {
					continue;
					handleNonOszFiles(files[i]);
				}
			} catch (e) {}
		}
	}
	async function getOszFileToUnzip(file, diffe = 0,mode) {
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
			try{minis.add(setMeta);}
			catch(e){}
			console.log(mode)
			if(mode)
				return
			else{
				console.log("here")
			fakeClick(Math.max(metaData.length,1), false);
			setSearchKey(searchKey + 1);}
			
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
	const [metaFiles, setMetaFiles] = useState([]);
	const [globalIndex, setGlobalIndex] = useState(-1);
	const [secondaryIndex, setSecondaryIndex] = useState(0);
	const [searchKey, setSearchKey] = useState(0);
	const [start, setStart] = useState(false);
	const [focus, setFocus] = useState(false);
	const [prevMusic, setPrevMusic] = useState([]);
	const [attempts, setAttempts] = useState(0);
	function getMetaFiles() {
		return metaFiles;
	}
	if (start) {
		backgroundImage.style.filter = "blur(0px) brightness(0.5)";
	} else {
		backgroundImage.style.filter = "blur(12px) brightness(0.5)";
	}
	function keyaction(e) {
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
	function keyaction2(e) {}

	useEffect(() => {
		if (!focus) return;
		
		document.addEventListener("keydown", keyaction);
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
				key={"element" + index}
				className={defaultElementClass + " bg-opacity-10 h-20 "}>
				<div
					onClick={() => {
						fakeClick(index, false);
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
					<div className="h-full w-full flex flex-col items-center bg-blank pointer-events-none p-2 bg-opacity-60">
						<div className="flex leading-[40px]  font-semibold text-[30px] pointer-events-none  self-start text-[#ccc] ">
							{element.title}
						</div>
						<div className="flex leading-[20px]   self-start ml-2 text-[#bbb] mb-[20px]  pointer-events-none text-[18px]">
							{element.artist + " - " + element.creator}
						</div>
					</div>
					<div
					id={"delete" + index}
					onClick={(e) => {
						e.stopPropagation();
						const request = indexedDB.open("osuStorage", 2);
						request.onsuccess = function (event) {
							const db = event.target.result;
							const transaction = db.transaction(
								["Assets", "Files", "Meta", "Preview"],
								"readwrite"
							);
							let objectStore = transaction.objectStore("Assets");
							objectStore.delete(element.setId);
							objectStore = transaction.objectStore("Files");
							objectStore.delete(element.setId);
							objectStore = transaction.objectStore("Meta");
							objectStore.delete(element.setId);
							objectStore = transaction.objectStore("Preview");
							objectStore.delete(element.setId);
							let temp = metaData;
							temp.splice(index, 1);
							setMetaData(temp);
							setMetaFiles(temp);
							
							
							
							setSearchKey(searchKey + 1);
							fakeClick(0, true);
						};
					}}
					className="h-full w-32 bg-black"></div>
				</div>
				<div className="p-2 max-h-[calc(50vh-80px)] overflow-y-scroll  pt-3">
					<div
						className="levhol l   w-full p-2 -mt-2  "
						style={{
							height: 96 + element.levels.length * 68 - 96 + "px",
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
										previewMapper.innerHTML = x.mapper;
										previewSource.innerHTML = utf8.decode(
											x.source
										);
										previewVersion2.innerHTML = x.level;
										previewTags.innerHTML = utf8.decode(
											x.tags
										);
										previewSong.innerHTML =
											metaData[index].title;
										previewArtist.innerHTML =
											metaData[index].artist;
										previewVersion.innerHTML = x.level;
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
											width: x.difficulty * 10 + "%",
											background:
												x.difficulty <= 3.5
													? "#A3BE8C"
													: x.difficulty <= 7
													? "#EBCB8B"
													: x.difficulty <= 8.5
													? "#D08770"
													: "#BF616A",
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	});
	return (
		<>
			{" "}
			<div id="screen1">
				<div
					key={searchKey}
					id="scrollMenu"
					className=" duration-300 fixed overflow-y-scroll z-0  scroll-smooth overflow-x-visible right-0  bg -post  pl-4   w-[100vw] items-end justify-end  grid   h-[150%] pt-[calc(50vh-88px)]  gap-y-[8px]  "
					onScroll={(e) => {
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
									setBackground(
										metaData[clost].backgroundImage
									);

									let x = metaData[clost].levels[0];
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

									playSong(
										metaData[clost].setId,
										0,
										x.previewTime
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
						opacity: start ? 0 : 1,
						pointerEvents: start ? "none" : "auto",
					}}>
					{list}

					<div
						id="emptyy"
						className="w-full h-[110vh]"
						onDragCapture={(e) => {
							e.preventDefault();
						}}></div>
				</div>
				<div
					style={{
						opacity: start ? 0 : 1,
						pointerEvents: start ? "none" : "auto",
					}}
					id="previewSearch"
					className="bg-post duration-300 bg-opacity-25  h-[60px] outline-bcol outline   backdrop-blur-md outline-1 w-full rounded-br-md top-0 left-0  fixed z-[12]">
					{focus && metaFiles.length > 0 ? <Preview /> : <></>}

					<div className="bg-post p-1 pl-2 outline-bcol outline-1   outline bg-opacity-30 rounded-lg w-[20vw] h-[40px] absolute right-[10px] top-[10px]">
						<div
							id="searchBar"
							className="pointer-events-none hidden  absolute flex items-center gap-1 justify-between w-[calc(20vw-20px)] h-[calc(38px-0.5rem)]  duration-200 text-slate-200 ">
							Search
						</div>
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
										setMetaData(metaFiles);
										let ind = -1;
										if (
											metaData[0].setId ==
											metaFiles[0].setId
										)
											ind = 0;
										setGlobalIndex(ind);
										setSecondaryIndex(0);
										setSearchKey(0);
										fakeClick(0, true);
										return;
									}
									let res = minis.search(e.target.value);
									let temp = [];
									for (let i in res) {
										let val=metaFiles.find(
											(x) => x.setId == res[i].setId
										)
										if(val!=undefined && val!=null)
										temp.push(
											val
										);
									}
									setMetaData(temp);
									setSearchKey(searchKey + 1);
									let ind = -1;
									if (metaData[0].setId == temp[0].setId)
										ind = 0;
									setGlobalIndex(ind);
									setSecondaryIndex(0);
									fakeClick(0, true);
								}, 1000);
							}}
							type="text"
							className=" h-full leading-[38px] -mt-[1Px] w-full  text-slate-200 bg-white bg-opacity-0 border-none outline-none focus:border-none rounded-md"
						/>
					</div>
					<div
						id="resetButton"
						className="w-16 h-16 bg-black hidden"
						onClick={() => {
							setMetaData(metaFiles);
							let ind = -1;
							setSearchKey(0);
							if (metaData[0].setId == metaFiles[0].setId) return;
							setGlobalIndex(ind);
							setSecondaryIndex(0);

							fakeClick(0, true);
						}}></div>
				</div>
				<div
					style={{ opacity: start ? 0 : 1 }}
					id="addOSZButton"
					className="w-full duration-300 h-full fixed z-20 pointer-events-none">
					<label
						//style={{ display: !props.playing ? "" : "none" }}
						htmlFor="inpp"
						className="fixed pointer-events-auto  bg-opacity-75 w-32  bg-post border text-bact border-bcol h-fit  z-[11]  rounded-md shadow-lg bottom-2 left-2  cursor-pointer   text-center py-4">
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
						//style={{ display: !props.playing ? "" : "none" }}
						style={{opacity:metaData.length<1?1:0,pointerEvents:metaData.length<1?"auto":"none"}}
						onClick={(e)=>{
							fetch(
								"/demo1.osz" // Fetches the file
							)
								.then((res) => res.blob()) // Gets the response and returns it as a blob
								.then((blob) => {
									
										
									let file=new File([blob], "demo1.osz", {type: "application/octet-stream"});
									console.log(file);
									getFiles([file]);
									
								});
								fetch(
									"/demo2.osz" // Fetches the file
								)
									.then((res) => res.blob()) // Gets the response and returns it as a blob
									.then(async(blob) => {
										let file=new File([blob], "demo1.osz", {type: "application/octet-stream"});
										console.log(file);
										getFiles([file],true);
										
									});
								
								return
						}}
						className="fixed pointer-events-auto  bg-opacity-75 w-32  bg-post border text-bact border-bcol h-fit  z-[11] duration-300 rounded-md shadow-lg bottom-2 left-36  cursor-pointer   text-center py-4">
						
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
