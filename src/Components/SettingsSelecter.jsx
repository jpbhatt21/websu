import { settings } from "../SettingsValues";
import { svg } from "../Utility/VectorGraphics";

function SettingsSelecter({ props }) {
	return (
		<>
			<div
				className="w-1/3 "
				style={{
					height: 30 * props.scale + "px",
				}}>
				<div
					className="w-full bg-ltpost  px-2 bg-opacity-50 backdrop-blur-sm outline-bdark outline-1   flex flex-col group items-start  overflow-hidden  outline  rounded-md h-fit"
					style={{
						backgroundColor: !settings.User_Interface["UI_BackDrop"]
							.value
							? "#2a2a2a"
							: "",
						backdropFilter: !settings.User_Interface["UI_BackDrop"]
							.value
							? "blur(0px)"
							: "",
						WebkitBackdropFilter: !settings.User_Interface[
							"UI_BackDrop"
						].value
							? " blur(0px) "
							: "",
					}}>
					<div
						className="duration-300  self-end aspect-square right-0 -translate-x-1/2 -translate-y-1/2 absolute group-focus-within:-rotate-180 pointer-events-none "
						style={{
							height: 10 * props.scale + "px",
							top: 15 * props.scale + "px",
						}}>
						{svg.downIcon}
					</div>
					<div className="flex">
						<input
							key={props.options[props.selected]}
							defaultValue={props.options[props.selected]}
							readOnly
							className="flex w-full select-none  bg-black cursor-pointer  bg-opacity-0 outline-0 justify-between peer"
							style={{
								height: 30 * props.scale + "px",
							}}
							onClick={(e) => {
								let st = window.getComputedStyle(
									e.target.parentElement.previousSibling
								);
								let tval =
									st.getPropertyValue("-webkit-transform") ||
									st.getPropertyValue("-moz-transform") ||
									st.getPropertyValue("-ms-transform") ||
									st.getPropertyValue("-o-transform") ||
									st.getPropertyValue("transform") ||
									"none";
								if (tval != "none") {
									var value = parseInt(
										tval
											.split("(")[1]
											.split(")")[0]
											.split(",")[0]
									);
									if (value == -1) {
										e.target.blur();
									}
								}
							}}
							onFocus={(e) => {
								e.currentTarget.parentElement.nextSibling.style.marginTop =
									2 * props.scale + "px";
								let children =
									e.currentTarget.parentElement.nextSibling
										.children;
								for (let i in props.options) {
									children[i].style.height =
										30 * props.scale + "px";
								}
							}}
							onBlur={(e) => {
								let children =
									e.currentTarget.parentElement.nextSibling
										.children;
								console.log(document.activeElement);
								e.currentTarget.parentElement.nextSibling.style.marginTop = 0;
								for (let i in props.options) {
									children[i].style.height = 0;
								}
							}}
						/>
					</div>
					<div
						className="flex flex-wrap overflow-scroll duration-300 border-t w-full border-bdark border-opacity-0 group-focus-within:border-opacity-100 "
						style={{
							maxHeight: 30 * 4.5 * props.scale + "px",
						}}>
						{props.options.map((x, i) => (
							<input
								key={props.key + " " + i}
								className="flex select-none outline-none duration-300 open bg-black bg-opacity-0 cursor-pointer   w-full h-0   justify-between"
								defaultValue={x}
								readOnly
								onFocus={(e) => {
									props.selecterSelecter(props.index, i);
									if (props.options[0] == "Auto") {
										e.currentTarget.blur();
										return;
									}
									e.currentTarget.parentElement.style.marginTop =
										2 * props.scale + "px";
									let children =
										e.currentTarget.parentElement.children;
									for (let i in props.options) {
										children[i].style.height =
											30 * props.scale + "px";
									}
								}}
								onBlur={(e) => {
									let children =
										e.currentTarget.parentElement.children;
									e.currentTarget.parentElement.style.marginTop = 0;
									for (let i in props.options) {
										children[i].style.height = 0;
									}
								}}></input>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default SettingsSelecter;
