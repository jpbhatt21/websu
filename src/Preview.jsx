let skewDeg = 8;
function Preview() {
	return (
		<>
		
			<div
				className="bg-post bg-opacity-25 max-h-[35svh] h-[20vw]  w-[55vw] fade-in2 text-center   border-t-0  ml-[-8vw] rounded-lg rounded-tr-none border border-bcol border-2 overflow-hidden"
				style={{
					transform:
						"skew(-" +
						skewDeg +
						"deg,-" +
						skewDeg +
						"deg) rotate(" +
						skewDeg +
						"deg)",
				}}>
				<img
					id="previewImage"
					className="w-full object-cover bg-center duration-300 h-full brightness-[65%] right-[-5vw] absolute  "
					style={{
						transform:
							"skew(" +
							skewDeg +
							"deg," +
							skewDeg +
							"deg) rotate(-" +
							skewDeg +
							"deg)",
					}}></img>
				<div
					className="w-[54vw] forFont  flex flex-col text-slate-50 text-base items-start max-h-[35svh]  justify-evenly pl-[2vw] h-[20vw] right-[-5vw] absolute  "
					style={{
						transform:
							"skew(" +
							skewDeg +
							"deg," +
							skewDeg +
							"deg) rotate(-" +
							skewDeg +
							"deg)",
					}}>
					<div
						className=" text-[2svh]   "
						id="previewVersion">
						[Version]
					</div>
					<div></div>

					<div className="flex flex-col  items-start">
					<div
						className=" text-[6svh] h-[4svh]  font-medium lg:text-[4.5svh]  "
						id="previewSong">
						[Song]
					</div>
					<div
						className=" text-[3svh] h-[2svh]  lg:text-[2svh] "
						id="previewArtist">
						[Artist]
					</div>
					</div>
					<div></div>
					<div className="bottom-[12%] flex   text-[3svh] lg:text-[2svh] gap-1 ">
						mapped by
						<div
							id="previewMapper"
							className=" text-blue-400 font-bold brightness-125">
							{"[Creator]"}
						</div>
					</div>
				</div>
			</div>
			<div
				id="infobox"
				className="bg-post bg-opacity-45 items-center  justify-evenly fade-in2 max-h-[44svh] min-h-[22svh] text-[2.2svh] lg:text-[1.8svh]  h-[18vw]  w-[43.5vw] flex flex-row  mt-1  ml-1 rounded-md border border-bcol border-1 "
				>
				<div
					id="circleSize"
					className="h-4/5 text-slate-300 flex flex-col justify-evenly  items-center   w-[18vw] "
					
					>
					<div className="flex justify-start bg-bl ack max-h-[10svh] w-full  flex-col h-1/4  gap-[calc(min(1.5svh,8px))]">
						Circle Size{" "}
						<div className="bg-gray-500   max-h-[1.5svh] rounded-lg h-2 w-full">
							<div
								id="previewCircleSize"
								className="-ml-[1px]  duration-300 bg-slate-100 w-1/2 max-h-[1.5svh] h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10svh]  w-full flex-col h-1/4  gap-[calc(min(1.5svh,8px))]">
						HP Drain
						<div className="bg-gray-500 rounded-lg max-h-[1.5svh] h-2 w-full">
							<div
								id="previewHPDrain"
								className="-ml-[1px] duration-300 max-h-[1.5svh]  bg-slate-100 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10svh]  w-full  flex-col h-1/4  gap-[calc(min(1.5svh,8px))]">
						Approach Rate
						<div className="bg-gray-500 max-h-[1.5svh] rounded-lg h-2 w-full">
							<div
								id="previewApproachRate"
								className="-ml-[1px] duration-300 max-h-[1.5svh] bg-slate-100 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10svh]  w-full flex-col h-1/4  gap-[calc(min(1.5svh,8px))]">
						Accuracy
						<div className="bg-gray-500 rounded-lg max-h-[1.5svh] h-2 w-full">
							<div
								id="previewAccuracy"
								className="-ml-[1px] duration-300 max-h-[1.5svh]  bg-slate-100 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
				</div>

				<div
					id="previewMisc"
					className="h-4/5   text-slate-300   justify-evenly  flex flex-col  w-[18vw] ">
					<div className="flex bg-b lack  mt-0 max-h-[10svh]  w-full    justify-start flex-col h-1/4 ">
						Version
						<div
							id="previewVersion2"
							className=" text-slate-100 text-[80%]  max-h-[1.5svh] h-2 ">
						-	
						</div>
					</div>

					<div className="flex   max-h-[10svh] w-full   justify-start flex-col h-1/4 ">
						Source
						<div
							id="previewSource"
							className=" text-slate-100 text-[80%] max-h-[1.5svh] h-2  ">
							-
						</div>
					</div>
					<div className="  max-h-[10svh]   h-1/4  w-full  justify-start flex-col">
						Tags
						<div
							id="previewTags"
							className=" text-ellipsis text-[80%]    max-h-[13svh]  h-[150%]  overflow-hidden text-slate-100  ">
							-
						</div>
					</div>
					<div className=" opacity-0   max-h-[10svh]   h-1/4 ">
						blank
						
					</div>
				</div>
			</div>
		</>
	);
}

export default Preview;
