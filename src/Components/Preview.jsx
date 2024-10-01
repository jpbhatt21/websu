let skewDeg = 8;
function Preview({props}) {
	return (
		<>
		
			<div

				className="bg-post lexend bg-opacity-25 shadow- xl shadow-colors- orange max-h-[35vh] h-[20vw]  w-[55vw] fade-in2 text-center   border-t-0  ml-[-8vw] rounded-lg rounded-tr-none border border-bcol border-2 overflow-hidden"
				style={{
					transform:
						"skew(-" +
						skewDeg +
						"deg,-" +
						skewDeg +
						"deg) rotate(" +
						skewDeg +
						"deg)",
						backgroundColor:!props.backdrop? "#252525":"",
						// boxShadow: "2px 2px 12px 2px #939393"
				}}>
				<img
					id="previewImage"
					onError={(e)=>{
						
							e.target.src="/original_1.jpg"
						
					}}
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
						className=" text-[6vh] h-[4vh] w-full   whitespace-nowrap text-ellipsis  font-medium lg:text-[4.5vh]  "
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
				className={"bg-post items-center  justify-evenly fade-in2 max-h-[44vh] min-h-[22vh] text-[2.2vh] lg:text-[1.8vh]  h-[18vw] -ml-[1.25vw] pl-[1.25vw] w-[45vw] flex flex-row  mt-1  rounded-md border border-bcol border-1 "}
				style={{
					backgroundColor:!props.backdrop? "#252525": "#2525254C"
				}}
				>
				<div
					id="circleSize"
					className="h-4/5 text-slate-300 flex flex-col justify-evenly  items-center   w-[18vw] "
					
					>
					<div className="flex justify-start bg-bl ack max-h-[10vh] w-full  flex-col h-1/4  gap-[calc(min(1.5vh,8px))]">
						Circle Size{" "}
						<div className="bg-bdark    max-h-[1.5vh] rounded-lg h-2 w-full">
							<div
								id="previewCircleSize"
								className="-ml-[1px]  duration-300 bg-gray-200 w-1/2 max-h-[1.5vh] h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10vh]  w-full flex-col h-1/4  gap-[calc(min(1.5vh,8px))]">
						HP Drain
						<div className="bg-bdark  rounded-lg max-h-[1.5vh] h-2 w-full">
							<div
								id="previewHPDrain"
								className="-ml-[1px] duration-300 max-h-[1.5vh]  bg-gray-200 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10vh]  w-full  flex-col h-1/4  gap-[calc(min(1.5vh,8px))]">
						Approach Rate
						<div className="bg-bdark  max-h-[1.5vh] rounded-lg h-2 w-full">
							<div
								id="previewApproachRate"
								className="-ml-[1px] duration-300 max-h-[1.5vh] bg-gray-200 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
					<div className="flex justify-start max-h-[10vh]  w-full flex-col h-1/4  gap-[calc(min(1.5vh,8px))]">
						Accuracy
						<div className="bg-bdark  rounded-lg max-h-[1.5vh] h-2 w-full">
							<div
								id="previewAccuracy"
								className="-ml-[1px] duration-300 max-h-[1.5vh]  bg-gray-200 w-1/2 h-2 rounded-lg"
								style={{ width: `0%` }}></div>
						</div>
					</div>
				</div>

				<div
					id="previewMisc"
					className="h-4/5   text-slate-300   justify-evenly  flex flex-col  w-[18vw] ">
					<div className="flex bg-b lack  mt-0 max-h-[10vh]  w-full    justify-start flex-col h-1/4 ">
						Version
						<div
							id="previewVersion2"
							className=" text-slate-100 text-[80%]  max-h-[1.5vh] h-2 ">
						-	
						</div>
					</div>

					<div className="flex   max-h-[10vh] w-full   justify-start flex-col h-1/4 ">
						Source
						<div
							id="previewSource"
							className=" text-slate-100 text-[80%] max-h-[1.5vh] h-2  ">
							-
						</div>
					</div>
					<div className="  max-h-[10vh]   h-1/4  w-full  justify-start flex-col">
						Tags
						<div
							id="previewTags"
							className=" text-ellipsis text-[80%]    max-h-[13vh]  h-[150%]  overflow-hidden text-slate-100  ">
							-
						</div>
					</div>
					<div className=" opacity-0   max-h-[10vh]   h-1/4 ">
						blank
						
					</div>
				</div>
			</div>
		</>
	);
}

export default Preview;
