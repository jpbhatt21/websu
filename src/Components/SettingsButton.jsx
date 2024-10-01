import { settings } from "../SettingsValues";

function SettignsButton({ props }) {
	return (
		<>
			<div className="w-full flex items-center justify-end h-1/2 ">
				<button
					onClick={() => {
                        if(props.element.title=="Unavailable")
                            return
						props.setResetFunction(props.element);
					}}
					className="w-32 bg-ltpost h-full text-colors px-3 bg-opacity-50 backdrop-blur-sm text-center  outline-colors-red outline-1  duration-300   flex items-center justify-center  overflow-hidden  outline  rounded-md "
					style={{
						backgroundColor: !settings.User_Interface["UI_BackDrop"].value ? "#2a2a2a" : "",
						backdropFilter: !settings.User_Interface["UI_BackDrop"].value ? "blur(0px)" : "",
						WebkitBackdropFilter: !settings.User_Interface["UI_BackDrop"].value ? " blur(0px) " : "",
					}}>
					{props.element.title}
				</button>
			</div>
		</>
	);
}

export default SettignsButton;
