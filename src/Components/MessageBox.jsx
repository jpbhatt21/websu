import { svg } from "../Utility/VectorGraphics";
function MessageBox({
	props
}) {
	return (
		<div
			id="messagebox"
			className="text-bhov fade-in  fixed bottom-0 text-[1.5vh] right-0 duration-300 flex flex-col justify-center item  bg-post  bg-opacity-50  h-fit  w-[22vh]    overflow-clip rounded-tl-md">
			<div
				id="looking"
				className="duration-300 opacity-0 overflow-hidden h-0 flex items-center">
				<div className="h-[3.5vh] scale-[60%]">{svg.loaderIcon2}</div>{" "}
				Looking for beatmaps
			</div>
			<div
				id="fetchingSong"
				className=" flex items-center opacity-0 overflow-hidden duration-300  h-0">
				<div className=" h-[3.5vh] scale-[60%]">{svg.loaderIcon2}</div>{" "}
				Fetching preview audio
			</div>
			<div
				id="fetchingSet"
				className=" flex items-center opacity-0 overflow-hidden duration-300  h-0">
				<div className=" h-[3.5vh] scale-[60%]">{svg.loaderIcon2}</div>{" "}
				Downloading
				<div id="downloadCounter" className="ml-[1vh]">
					{"(" + 0 + "/" + 0 + ")"}
				</div>
			</div>
			<div
				id="unzippingSet"
				className=" flex items-center opacity-0 overflow-hidden duration-300  h-0">
				<div className=" h-[3.5vh] scale-[60%]">{svg.loaderIcon2}</div>{" "}
				Unzipping
				<div id="unzipCounter" className="ml-[1vh]">
					{"(" + 0 + "/" + 0 + ")"}
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
			{/* <div
				id="clickToUnmute"
				className=" flex items-center opacity- 0 ml-[1vh]   overflow-hidden duration-300  h-[3.5vh]">
				Click anywhere to unmute
			</div> */}

			<div
				
				style={{
					height: props.showFps ? "3.5vh" : 0,
				}}
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
	);
}

export default MessageBox;
