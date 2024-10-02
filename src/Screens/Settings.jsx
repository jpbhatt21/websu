import { useState } from "react";
import SettingsListElement from "../Components/SettingsListElement";
import { settings } from "../SettingsValues";
import { svg } from "../Utility/VectorGraphics";
let settingScrollTimeout = null;
let root = document.querySelector(":root");
function Settings({ props }) {
	root.style.setProperty("--scale", props.scale);
	const [settingScrollIndex, setSettingScrollIndex] = useState(0);
	let icons = [
		svg.smileyIcon,
		svg.unmuteIcon2,
		svg.gameIcon,
		svg.keyBindingIcon,
		svg.manageIcon,
	];
	return (
		<div
			className="fixed w-full h-full pointer-events-auto"
			onClick={(e) => {
				if (e.currentTarget == e.target) {
					e.preventDefault();
					stb.click();
				}
			}}>
			<div
				id="settingsPage"
				className="w-full lg:w-[1024px]  slide-in pointer-events-auto h-full duration-300 transition-all flex bg-opacity-50 bg-post backdrop-blur-md"
				style={{
					backgroundColor: !settings.User_Interface.UI_BackDrop.value
						? "#252525"
						: "",
					paddingTop: 60 * props.scale + "px",
					width:
						Math.min(window.innerWidth, 1024 * props.scale) + "px",
				}}>
				<div
					className="min-w-64 bg-blank bg-opacity-75 flex flex-col duration-300  gap-5 pt-5 border-r border-[#636363] h-full"
					style={{
						backgroundColor: !settings.User_Interface.UI_BackDrop
							.value
							? "#202020"
							: "#2020209C",
						minWidth: 236 * props.scale + "px",
						gap: 20 * props.scale + "px",
						paddingTop: 20 * props.scale + "px",
					}}>
					{Object.keys(settings).map((x, index) => (
						<div
							key={"settingTitle" + index}
							className="flex items-center w-full h-12 gap-2 text-white cursor-pointer select-none group justify -between "
							onClick={() => {
								let children = settingsScroll.childNodes;
								console.log();
								settingsScroll.scrollTo({
									top:
										settingsScroll.scrollTop +
										(children[index].getBoundingClientRect()
											.top -
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
								height: 48 * props.scale + "px",
								fontSize: 20 * props.scale + "px",
								gap: 8 * props.scale + "px",
							}}>
							<div
								className="duration-300 bg-white rounded-full h-4/5 group-active:h-full"
								style={{
									height:
										settingScrollIndex == index
											? ""
											: "0rem",
									opacity:
										settingScrollIndex == index ? "1" : "0",
									marginLeft: 8 * props.scale + "px",
									width: 8 * props.scale + "px",
								}}
							/>
							<div className="duration-300 h-2/3 group-active:animate-pulse aspect-square">
								{icons[index]}
							</div>
							<div className="duration-300 group-active:scale-90 lexend">
								{x.replace("_", " ")}
							</div>
						</div>
					))}
				</div>
				<div
					id="settingsScroll"
					className="flex flex-wrap items-start w-full h-full overflow-scroll duration-300 border-r-2 border-bcol "
					style={{
						padding: 20 * props.scale + "px",
						paddingTop: 16 * props.scale + "px",
						paddingBottom: 70 * props.scale + "px",
					}}
					onScroll={(e) => {
						if (settingScrollTimeout)
							clearTimeout(settingScrollTimeout);
						settingScrollTimeout = setTimeout(() => {
							let children = e.target.childNodes;

							let i = 0;
							for (i = 0; i < children.length - 1; i++) {
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
					{Object.keys(settings).map((x, index) => (
						<SettingsListElement
							key={"settings" + index}
							props={{
								x: { name: x, settings: settings[x] },
								index,
								settingScrollIndex,
								changeSettings: props.changeSettings,
								setResetFunction: props.setResetFunction,
								scale: props.scale,
							}}
						/>
					))}
					<div
						className="w-full h-full"
						style={{
							height: "calc(100% - 32rem )",
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default Settings;
