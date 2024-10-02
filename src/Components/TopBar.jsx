import { settings } from "../SettingsValues";
import { svg } from "../Utility/VectorGraphics";
import MusicPlayer from "./MusicPlayer";
let settingTimer = null;
function TopBar({ props }) {
	return (
		<>
			<div
				style={{
					opacity: 1,
					marginTop:
						(props.showTopBar ? 0 : -60 * props.scale) + "px",
				}}
				id="topBar"
				className="w-full h-full flex pointer-events-none duration-300 flex-col fixed z-30 ">
				<div
					style={{
						pointerEvents: props.showTopBar ? "auto" : "none",
						backgroundColor: !settings.User_Interface.UI_BackDrop
							.value
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
						height: 60 * props.scale + "px",
						gap: 8 * props.scale + "px",
						paddingRight: 8 * props.scale + "px",
					}}
					className="bg-post flex items-center justify-end duration-300 bg-opacity-50   border-bcol  border-b-2  backdrop-blur-md   w-full  top-0 left-0  ">
					<div className="h-full flex items-center  w-full">
						<div
							className="h-full overflow-hidden aspect-square group text-bcol hover:text-white duration-300 flex flex-wrap items-center justify-center"
							style={{
								marginRight:-10*props.scale+"px",
								marginLeft:((!props.showHome || props.showSettings)?2:-45)*props.scale+"px"
							}}>
							<div
								id="stb"
								className="h-full flex items-center justify-center  aspect-square"
								onClick={() => {
									if (settingTimer) return;
									if (props.showSettings) {
										settingsPage.style.transform =
											"translateX(-100%)";
										// if (
										// 	(metaFiles.length > 0 &&
										// 		!onlineMode) ||
										// 	(webSearchData.length > 0 &&
										// 		onlineMode)
										// )
										// 	previewContainer.style.opacity = 1;
										// scrollMenu.style.marginRight = "";
										settingTimer = setTimeout(() => {
											props.setShowSettings(
												!props.showSettings
											);
											settingTimer = null;
										}, 300);
									} else {
										props.setShowSettings(
											!props.showSettings
										);
										settingTimer = setTimeout(() => {
											settingTimer = null;
										}, 300);
									}
								}}>
								<div className="h-1/2 -mt-1  aspect-square">
									{svg.settingsIcon}
								</div>
							</div>
							<div
								className="absolute delay-0 group-hover:delay-500 text-bcol group-hover:text-white opacity-0 duration-300 pointer-events-none transition-opacity group-hover:opacity-100 "
								style={{
									transform: "scale(" + props.scale + ")",
								}}>
								<div className="h-full ml-5 mt-28 bg-opacity-50 bg-post pb-[6px] p-1  rounded-md  min-w-fit flex">
									Settings
								</div>
							</div>
						</div>
						<div
							className="h-full aspect-square group text-bcol hover:text-white duration-300 flex flex-wrap items-center justify-center"
							style={{}}>
							<div
								id="returnHome"
								className="h-full flex items-center justify-center  aspect-square"
								onClick={() => {
									props.setShowHome(true)
									
								}}>
								<div className="h-1/2 -mt-1  aspect-square">
									{svg.homeIcon}
								</div>
							</div>
							<div
								className="absolute delay-0 group-hover:delay-500 text-bcol group-hover:text-white opacity-0 duration-300 pointer-events-none transition-opacity group-hover:opacity-100 "
								style={{
									transform: "scale(" + props.scale + ")",
									marginLeft:((!props.showHome || props.showSettings)?0:52)*props.scale+"px"
								}}>
								<div className="h-full mt-28 bg-opacity-50 bg-post pb-[6px] p-1  whitespace-nowrap rounded-md  min-w-fit ">
									Return Home
								</div>
							</div>
						</div>
						<div
							className="h-[60px] w-64"
							style={{
								transform: "scale(" + props.scale + ")",
								marginLeft: ((props.scale - 1) * 128 +2)+ "px",
							}}>
							<MusicPlayer />
						</div>
					</div>

					<div>
						<div
							id="dateTime"
							className="text-bact flex items-center justify-center"
							style={{
								fontSize: 16 * props.scale + "px",
								width: 96 * props.scale + "px",
							}}>
							<span className="w-1/4 text-end">00:</span>
							<span className="w-1/4 text-end">00:</span>
							<span className="w-1/4">00</span>
						</div>
						<div
							id="playTime"
							className="text-bact flex items-center justify-center"
							style={{
								fontSize: 16 * props.scale + "px",
								width: 96 * props.scale + "px",
							}}>
							<span className="w-1/4 text-end">00:</span>
							<span className="w-1/4 text-end">00:</span>
							<span className="w-1/4">00</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default TopBar;
