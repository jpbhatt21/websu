import { useState } from "react";
import Selecter from "./Selecter";
import Toggle from "./Toggle";
import SettingsSlider from "./SettingsSlider";
import { setSettings, settings, defaultSettings } from "../SettingsValues";
import { svg } from "../Utility/VectorGraphics";
import SettignsButton from "./SettingsButton";

function SettingsListElement({
	x,
	index,
	settingScrollIndex,
	sst,
	backdrop,
	setFun,
	scale,
}) {
	const [key, setKey] = useState(0);
	function toggleClick(i) {
		let prev = settings;
		prev[x.name][i].value = !prev[x.name][i].value;
		sst((prev) => prev + 1);
		setSettings(prev);
	}
	function selecterSelecter(i, val) {
		let prev = settings;
		prev[x.name][i].value = val;
		sst((prev) => prev + 1);
		setSettings(prev);
	}
	function resetToDefault(i) {
		let prev = settings;
		prev[x.name][i].value = defaultSettings[x.name][i].value;
		sst((prev) => prev + 1);
		setKey((prev) => prev + 1);
		setSettings(prev);
	}
	return (
		<>
			<div
				className="w-full h-fit   duration-300  text-white flex-col flex  text-lg    "
				onClick={(e) => {
					if (settingScrollIndex != index)
						settingsScroll.scrollTo({
							top:
								settingsScroll.scrollTop +
								(e.currentTarget.getBoundingClientRect().top -
									settingsScroll.getBoundingClientRect()
										.top) -
								29,
							behavior: "smooth",
						});
				}}
				style={{
					filter:
						settingScrollIndex == index ? "" : "brightness(65%)",
					fontSize: 18 * scale + "px",
					lineHeight: 24 * scale + "px",
				}}>
				<div
					className=" text-3xl lexend -ml-2"
					style={{ fontSize: 30 * scale + "px",
						marginTop: 20 * scale + "px",
						marginLeft:-8*scale+"px",
					 }}>
					{" "}
					{x.name.replace("_", " ")}
				</div>
				<div
					className="flex w-full flex-col-reverse gap-2"
					style={{
						pointerEvents:
							settingScrollIndex == index ? "" : "none",
							paddingTop: 20 * scale + "px",
							gap:8*scale+"px",
					}}>
					{Object.keys(x.settings)
						.reverse()
						.map((y, index2) => (
							<div
								key={"settings" + index + " " + index2}
								className="text-bact relative  justify-between flex  items-center w-full"
								style={{
									height: 60 * scale + "px",
								}}>
								<div
									className="w-64 items-center flex h-full -mt-1"
									style={{
										width: 256 * scale + "px",
									}}>
									<div
										className="min-w-fit"
										style={{
											width: 256 * scale + "px",
										}}>
										{y.replace("_", " ")}
									</div>
									{x.settings[y].type != "button" &&
									defaultSettings[x.name][y].value !=
										x.settings[y].value ? (
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
								{x.settings[y].type == "toggle" ? (
									<Toggle
										mode={backdrop}
										value={x.settings[y].value}
										onClick={() => {
											toggleClick(y);
										}}
									/>
								) : x.settings[y].type == "list" ? (
									<Selecter
										backdrop={backdrop}
										key2={"selecter" + index + " " + index2}
										index={y}
										options={x.settings[y].options}
										selected={x.settings[y].value}
										selecterSelecter={selecterSelecter}
										scale={scale}
									/>
								) : x.settings[y].type == "slider" ? (
									<SettingsSlider
										key={"setting" + y + "" + key}
										index={y}
										value={x.settings[y].value}
										selecterSelecter={selecterSelecter}
									/>
								) : x.settings[y].type == "button" ? (
									<SettignsButton
										backdrop={backdrop}
										y={x.settings[y]}
										setFun={setFun}
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
