import { useState } from "react";
import { svg } from "../Utility/VectorGraphics";

function Selecter({
	options,
	selected,
	key2 = "",
	index,
	selecterSelecter,
	backdrop,
}) {
	//const [open,setOpen]=useState(false)
	return (
		<>
			<div className="w-1/3 h-[30px] max-h-[6vh] ">
				<div
					className="w-full bg-ltpost  px-2 bg-opacity-50 backdrop-blur-sm outline-bdark outline-1  duration-300   flex flex-col group items-start  overflow-hidden  outline  rounded-md h-fit"
					style={{
						backgroundColor: !backdrop
							? "#2a2a2a"
							: "",
						backdropFilter: !backdrop
							? "blur(0px)"
							: "",
						WebkitBackdropFilter: !backdrop
							? " blur(0px) "
							: "",
					}}>
					<div className="duration-300 h-[10px] max-h-[2vh] self-end top-[15px]  aspect-square right-0 -translate-x-1/2 -translate-y-1/2 absolute group-focus-within:-rotate-180 pointer-events-none ">
						{svg.downIcon}
					</div>
					<div className="flex">
						<input
							key={options[selected]}
							defaultValue={options[selected]}
							readOnly
							className="flex w-full select-none  bg-black cursor-pointer  bg-opacity-0 h-[30px] max-h-[6vh] outline-0 justify-between peer"
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
						/>
					</div>
					<div className="flex flex-wrap overflow-scroll duration-300 group-focus-within:my-[2px] border-t w-full border-bdark border-opacity-0 group-focus-within:border-opacity-100 ">
						{options.map((x, i) => (
							<input
								key={key2 + " " + i}
								className="flex select-none outline-none duration-300 open bg-black bg-opacity-0 cursor-pointer   w-full h-0  group-focus-within:h-[30px] max-h-[6vh] justify-between"
								defaultValue={x}
								readOnly
								onFocus={() => {
									selecterSelecter(index, i);
								}}></input>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default Selecter;
