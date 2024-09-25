import { useState } from "react";
import SettingsListElement from "./Components/SettingsListElement";
import { settings } from "./SettingsValues";
import { svg } from "./Utility/VectorGraphics";
let settingScrollTimeout=null
function SettingsScreen({setUpdateSettings}) {
    const [settingScrollIndex, setSettingScrollIndex] = useState(0);
    let icons=[svg.smileyIcon,svg.unmuteIcon2,svg.gameIcon,svg.manageIcon]
	return (
		<>
			<div
				id="settingsPage"
				className="w-full lg:w-[50vw]  slide-in   pointer-events-auto absolute h-full duration-300 transition-all    ">
				<div className="h-[60px] min-h-[5vh] max-h-[10vh]  border-b-2 opacity-0 "></div>
				<div
					className="w-full flex  h-full  bg-post bg-opacity-50 duration-300  "
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
						}}>
						{(Object.keys(settings)).map((x, index) => (
							<div
								key={"settingTitle" + index}
								className="w-full h-12 text-white select-none group  cursor-pointer flex items-center text-xl gap-2  justify -between  "
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
								}}>
								<div
									className="h-4/5 group-active:h-full rounded-full w-2 ml-2 bg-white duration-300"
									style={{
										height:
											settingScrollIndex == index
												? ""
												: "0rem",
										opacity:
											settingScrollIndex == index
												? "1"
												: "0",
									}}
								/>
                                <div className="h-2/3 group-active:animate-pulse duration-300 aspect-square">
                                    {icons[index]}
                                </div>
								<div className="group-active:scale-90 duration-300">
									{x.replace("_"," ")}
								</div>
							</div>
						))}
					</div>
					<div
						id="settingsScroll"
						className="w-full h-full p-5 duration-300 items-start border-r-2 border-bcol  flex flex-wrap overflow-scroll   "
						style={{
							paddingTop: "8px",
							paddingBottom: "70px",
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
							/>
						))}
						<div className="h-full mb-8" />
					</div>
				</div>
			</div>
		</>
	);
}

export default SettingsScreen;
