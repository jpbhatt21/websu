import { useState } from "react";
import SettingsListElement from "../Components/SettingsListElement";
import { settings } from "../SettingsValues";
import { svg } from "../Utility/VectorGraphics";
let settingScrollTimeout=null
let root=document.querySelector(":root")
function SettingsScreen({setUpdateSettings,setFun,scale}) {
	root.style.setProperty("--scale",scale)
    const [settingScrollIndex, setSettingScrollIndex] = useState(0);
    let icons=[svg.smileyIcon,svg.unmuteIcon2,svg.gameIcon,svg.keyBindingIcon,svg.manageIcon]
	return (
		<>
			<div className="w-full h-full pointer-events-auto fixed"
			onClick={(e)=>{
				if(e.currentTarget==e.target)
				stb.click()
			}}
			>
			<div
				id="settingsPage"
				className="w-full lg:w-[1024px]  slide-in pointer-events-auto h-full duration-300 transition-all"
				style={{
					paddingTop: 60*scale+"px",
					width:Math.min(window.innerWidth,1024*scale)+"px",
				}}
				>
				<div
					className="w-full flex  h-full  bg-post backdrop-blur-md bg-opacity-50 duration-300  "
					style={{
						backgroundColor: ! settings.User_Interface.UI_BackDrop.value
							? "#252525"
							: "",
					}}>
					<div
						className="min-w-64 bg-blank bg-opacity-75 flex flex-col duration-300  gap-5 pt-5 border-r border-[#636363] h-full"
						style={{
							backgroundColor: ! settings.User_Interface.UI_BackDrop.value
								? "#202020"
								: "#2020209C",
								minWidth:236*scale+"px",
								gap:20*scale+"px",
								paddingTop: 20*scale+"px",
						}}>
						{(Object.keys(settings)).map((x, index) => (
							<div
								key={"settingTitle" + index}
								className="w-full h-12 text-white select-none group  cursor-pointer flex items-center gap-2  justify -between  "
								onClick={() => {
									let children = settingsScroll.childNodes;
									console.log();
									settingsScroll.scrollTo({
										top:
											settingsScroll.scrollTop +
											(children[
												index
											].getBoundingClientRect().top -
												settingsScroll.getBoundingClientRect()
													.top) -
											29,
										behavior: "smooth",
									});
									setSettingScrollIndex(index);
								}}
								style={{
									color:
										settingScrollIndex == index
											? "#fff"
											: "#aaa",
											height:48*scale+"px",
											fontSize:20*scale+"px",
											gap:8*scale+"px",
								}}>
								<div
									className="h-4/5 group-active:h-full rounded-full  bg-white duration-300"
									style={{
										height:
											settingScrollIndex == index
												? ""
												: "0rem",
										opacity:
											settingScrollIndex == index
												? "1"
												: "0",
												marginLeft: 8*scale+"px",
												width:8*scale+"px",
									}}
								/>
                                <div className="h-2/3 group-active:animate-pulse duration-300 aspect-square">
                                    {icons[index]}
                                </div>
								<div className="group-active:scale-90 lexend duration-300">
									{x.replace("_"," ")}
								</div>
							</div>
						))}
					</div>
					<div
						id="settingsScroll"
						className="w-full h-full duration-300 items-start border-r-2 border-bcol  flex flex-wrap overflow-scroll   "
						style={{
							padding: 20*scale+"px",
							paddingTop: 16*scale+"px",
							paddingBottom: 70*scale+"px",
						}}
						onScroll={(e) => {
							if (settingScrollTimeout)
								clearTimeout(settingScrollTimeout);
							settingScrollTimeout = setTimeout(() => {
								let children = e.target.childNodes;
                                
								let i = 0;
								for (i = 0; i < children.length-1; i++) {
									let j = children[i].getBoundingClientRect();
									if (
										j.top -
											settingsScroll.getBoundingClientRect()
												.top >
										120
									)
										break;
								}
                                
								setSettingScrollIndex(i - 1);
								settingScrollTimeout = null;
							}, 50);
						}}>
						{(Object.keys(settings)).map((x, index) => (
							<SettingsListElement
								key={"settings" + index}
								x={{name:x,settings:settings[x]}}
								index={index}
								settingScrollIndex={settingScrollIndex}
								backdrop={ settings.User_Interface.UI_BackDrop.value}
								sst={setUpdateSettings}
								setFun={setFun}
								scale={scale}
							/>
						))}
						<div className="h-full w-full"
						style={{
							height:"calc(100% - 32rem )"
						}}
						/>
					</div>
				</div>
			</div>
			</div>
		</>
	);
}

export default SettingsScreen;
