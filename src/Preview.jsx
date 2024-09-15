let skewDeg = 8;
function Preview() {
    return ( <>
    <div
					className="bg-post bg-opacity-25 h-[15vw] w-[55vw] text-center  fixed top-[62px]  left-[-8vw] rounded-lg rounded-tr-none outline outline-bcol outline-1 overflow-hidden"
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
						className="w-[54vw] forFont  flex flex-col text-slate-50 text-base items-start pl-[2vw] h-[15vw] right-[-5vw] absolute  "
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
							className="top-[10%] text-[25px]  absolute"
							id="previewVersion">
							[Version]
						</div>
						<div
							className="top-[50%] text-[38px]  absolute"
							id="previewSong">
							[Song]
						</div>
						<div
							className="top-[calc(50%+38px)]   text-[20px] absolute"
							id="previewArtist">
							[Artist]
						</div>
						<div className="bottom-[12%] flex font-bold text-[20px] gap-1 absolute">
							mapped by
							<div id="previewMapper" className=" text-blue-400">
								{"[Mapper]"}
							</div>
						</div>
					</div>
				</div>
				<div
					id="infobox"
					className="bg-post bg-opacity-45 p-5  text-base h-fit gap-8 w-[calc(44vw-10px)] flex flex-row  fixed top-[calc(15vw+75px)]  left-[5px] rounded-md outline outline-bcol outline-1 ">
					<div
						id="circleSize"
						className="h-fit text-slate-300 flex flex-col justify-start  gap-5 w-1/2 ">
						<div className="flex justify-start flex-col h-[48px] gap-2">
							Circle Size{" "}
							<div className="bg-gray-500 rounded-lg h-2 w-full">
								<div
									id="previewCircleSize"
									className="-ml-[1px] duration-300 bg-slate-100 w-1/2 h-2 rounded-lg"
									style={{ width: `0%` }}></div>
							</div>
						</div>
						<div className="flex justify-start flex-col h-[48px] gap-2">
							HP Drain
							<div className="bg-gray-500 rounded-lg h-2 w-full">
								<div
									id="previewHPDrain"
									className="-ml-[1px] duration-300  bg-slate-100 w-1/2 h-2 rounded-lg"
									style={{ width: `0%` }}></div>
							</div>
						</div>
						<div className="flex justify-start flex-col h-[48px] gap-2">
							Approach Rate
							<div className="bg-gray-500 rounded-lg h-2 w-full">
								<div
									id="previewApproachRate"
									className="-ml-[1px] duration-300  bg-slate-100 w-1/2 h-2 rounded-lg"
									style={{ width: `0%` }}></div>
							</div>
						</div>
						<div className="flex justify-start flex-col h-[48px] gap-2">
							Accuracy
							<div className="bg-gray-500 rounded-lg h-2 w-full">
								<div
									id="previewAccuracy"
									className="-ml-[1px] duration-300  bg-slate-100 w-1/2 h-2 rounded-lg"
									style={{ width: `0%` }}></div>
							</div>
						</div>
					</div>

					<div
						id="previewMisc"
						className="h-fit   text-slate-300  duration-300 justify-start  ]  w-1/2 ">
						<div className="flex absolute mt-0 justify-start flex-col h-[48px]">
							Version
							<div
								id="previewVersion2"
								className=" text-slate-100 duration-300 ">
								- - -
							</div>
						</div>

						<div className="flex absolute mt-[68px] justify-start flex-col h-[48px]">
							Source
							<div
								id="previewSource"
								className=" text-slate-100 duration-300 ">
								- - - - -
							</div>
						</div>
						<div className="flex  mt-[136px]  justify-start flex-col h-fit">
							Tags
							<div
								id="previewTags"
								className=" text-ellipsis text-slate-100 duration-300 ">
								- - -
							</div>
						</div>
					</div>
				</div>
    </> );
}

export default Preview;