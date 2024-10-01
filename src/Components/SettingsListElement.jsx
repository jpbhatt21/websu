import { useState } from "react";
import SettingsSelecter from "./SettingsSelecter";
import Toggle from "./Toggle";
import SettingsSlider from "./SettingsSlider";
import { setSettings, settings, defaultSettings } from "../SettingsValues";
import { svg } from "../Utility/VectorGraphics";
import SettignsButton from "./SettingsButton";
import SettingsKey from "./SettingsKey";

function SettingsListElement({ props }) {
	const [key, setKey] = useState(0);
	function toggleClick(i) {
		let prev = settings;
		prev[props.x.name][i].value = !prev[props.x.name][i].value;
		props.changeSettings((prev) => prev + 1);
		setSettings(prev);
	}
	function selecterSelecter(i, val) {
		let prev = settings;
		prev[props.x.name][i].value = val;
		props.changeSettings((prev) => prev + 1);
		setSettings(prev);
	}
	function resetToDefault(i) {
		let prev = settings;
		prev[props.x.name][i].value = defaultSettings[props.x.name][i].value;
		props.changeSettings((prev) => prev + 1);
		setKey((prev) => prev + 1);
		setSettings(prev);
	}
	return (
		<>
			<div
				className="flex flex-col w-full text-lg text-white duration-300 h-fit"
				style={{
					// filter:
					// 	settingScrollIndex == index ? "" : "brightness(65%)",
					fontSize: 18 * props.scale + "px",
					lineHeight: 24 * props.scale + "px",
				}}>
				<div
					className="-ml-2 text-3xl lexend"
					style={{
						fontSize: 30 * props.scale + "px",
						marginTop: 20 * props.scale + "px",
						marginLeft: -8 * props.scale + "px",
					}}
					onClick={(e) => {
						if (props.settingScrollIndex != props.index)
							settingsScroll.scrollTo({
								top:
									settingsScroll.scrollTop +
									(e.currentTarget.getBoundingClientRect()
										.top -
										settingsScroll.getBoundingClientRect()
											.top) -
									29,
								behavior: "smooth",
							});
					}}>
					{" "}
					{props.x.name.replace("_", " ")}
				</div>
				<div
					className="flex flex-col-reverse w-full gap-2"
					style={{
						// pointerEvents:
						// 	settingScrollIndex == index ? "" : "none",
						paddingTop: 20 * props.scale + "px",
						gap: 8 * props.scale + "px",
					}}>
					{Object.keys(props.x.settings)
						.reverse()
						.map((y, index2) => (
							<div
								key={"settings" + props.index + " " + index2}
								className="relative flex items-center justify-between w-full text-bact"
								style={{
									height: 60 * props.scale + "px",
								}}>
								<div
									className="flex items-center w-64 h-full -mt-1"
									style={{
										width: 256 * props.scale + "px",
									}}>
									<div
										className="min-w-fit"
										style={{
											width: 256 * props.scale + "px",
											fontSize:
												props.x.settings[y].type ==
												"Subheading"
													? 25 * props.scale + "px"
													: "",
											color:
												props.x.settings[y].type ==
												"Subheading"
													? "#ddd"
													: "",
										}}>
										{y.replace("_", " ")}
									</div>
									{props.x.settings[y].type != "button" &&
									defaultSettings[props.x.name][y].value !=
										props.x.settings[y].value ? (
										<div
											onClick={() => {
												resetToDefault(y);
											}}
											className="h-1/2 spin-in aspect-square">
											{svg.replayIcon}
										</div>
									) : (
										<></>
									)}
								</div>
								{props.x.settings[y].type == "toggle" ? (
									<Toggle
										props={{
											value: props.x.settings[y].value,
											onClick: () => {
												toggleClick(y);
											},
										}}
									/>
								) : props.x.settings[y].type == "list" ? (
									<SettingsSelecter
										props={{
											index: y,
											options:
												props.x.settings[y].options,
											selected: props.x.settings[y].value,
											selecterSelecter,
											scale: props.scale,
											key:
												"selecter" +
												props.index +
												" " +
												index2,
										}}
									/>
								) : props.x.settings[y].type == "slider" ? (
									<SettingsSlider
										key={"setting" + y + "" + key}
										props={{
											index: y,
											value: props.x.settings[y].value,
											selecterSelecter,
										}}
									/>
								) : props.x.settings[y].type == "button" ? (
									<SettignsButton
										props={{
											element: props.x.settings[y],
											setResetFunction:
												props.setResetFunction,
										}}
									/>
								) : props.x.settings[y].type == "key" ? (
									<SettingsKey
										props={{ element: props.x.settings[y] }}
									/>
								) : (
									<></>
								)}
							</div>
						))}
				</div>
			</div>
		</>
	);
}

export default SettingsListElement;
