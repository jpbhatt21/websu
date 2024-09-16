let skewDeg = 8;
function Preview() {
	return (
		<>
			<div
				className="bg-post bg-opacity-25 max-h-[35vh] h-[20vw]  w-[55vw] fade-in2 text-center   border-t-0  ml-[-8vw] rounded-lg rounded-tr-none border border-bcol border-2 overflow-hidden"
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
					className="w-[54vw] forFont  flex flex-col text-slate-50 text-base items-start max-h-[35vh]  justify-evenly pl-[2vw] h-[20vw] right-[-5vw] absolute  "
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
						className=" text-[2vh]   "
						id="previewVersion">
						[Version]
					</div>
					<div></div>

					<div className="flex flex-col  items-start">
					<div
						className=" text-[6vh] h-[4vh]  font-medium lg:text-[4.5vh]  "
						id="previewSong">
						[Song]
					</div>
					<div
						className=" text-[3vh] h-[2vh]  lg:text-[2vh] "
						id="previewArtist">
						[Artist]
					</div>
					</div>
					<div></div>
					<div className="bottom-[12%] flex   text-[3vh] lg:text-[2vh] gap-1 ">
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
				className="bg-post bg-opacity-45 p-2 py-[2vh] xl:p-5 fade-in2 max-h-[44vh] min-h-[22vh] text-[2.2vh] lg:text-[1.8vh]  h-[18vw] gap-8 w-[calc(44vw-14px)] flex flex-row  mt-1  ml-1 rounded-md border border-bcol border-1 "
				>
				<div
					id="circleSize"
					className="h-full text-slate-300 flex flex-col justify-evenly    w-1/2 "
					
					>
					<div className="flex justify-start bg-bl ack max-h-[10vh]   flex-col h-[48px] gap-[calc(min(1.5vh,8px))]">
						Circle Size{" "}
						<div className="bg-gray-500   max-h-[1.5vh] rounded-lg h-2 w-full">
							<div
								id="previewCircleSize"
								className="-ml-[1px]  duration-300 bg-slate-100 w-1/2 max-h-[1.5vh] h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10vh]   flex-col h-[48px] gap-[calc(min(1.5vh,8px))]">
						HP Drain
						<div className="bg-gray-500 rounded-lg max-h-[1.5vh] h-2 w-full">
							<div
								id="previewHPDrain"
								className="-ml-[1px] duration-300 max-h-[1.5vh]  bg-slate-100 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10vh]    flex-col h-[48px] gap-[calc(min(1.5vh,8px))]">
						Approach Rate
						<div className="bg-gray-500 max-h-[1.5vh] rounded-lg h-2 w-full">
							<div
								id="previewApproachRate"
								className="-ml-[1px] duration-300 max-h-[1.5vh] bg-slate-100 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10vh]   flex-col h-[48px] gap-[calc(min(1.5vh,8px))]">
						Accuracy
						<div className="bg-gray-500 rounded-lg max-h-[1.5vh] h-2 w-full">
							<div
								id="previewAccuracy"
								className="-ml-[1px] duration-300 max-h-[1.5vh]  bg-slate-100 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
				</div>

				<div
					id="previewMisc"
					className="h-full   text-slate-300   justify-evenly  flex flex-col  w-1/2 ">
					<div className="flex bg-b lack  mt-0 max-h-[10vh]      justify-start flex-col h-[48px]">
						Version
						<div
							id="previewVersion2"
							className=" text-slate-100 text-[80%]  max-h-[1.5vh] h-2 ">
						-	
						</div>
					</div>

					<div className="flex   max-h-[10vh]   justify-start flex-col h-[48px]">
						Source
						<div
							id="previewSource"
							className=" text-slate-100 text-[80%] max-h-[1.5vh] h-2  ">
							-
						</div>
					</div>
					<div className="  max-h-[10vh]   h-[48px] w-full  justify-start flex-col">
						Tags
						<div
							id="previewTags"
							className=" text-ellipsis text-[80%]    max-h-[13vh]  h-[96px] overflow-hidden text-slate-100  ">
							-
						</div>
					</div>
					<div className=" opacity-0   max-h-[10vh]   h-[48px]">
						blank
						
					</div>
				</div>
			</div>
		</>
	);
}

export default Preview;
