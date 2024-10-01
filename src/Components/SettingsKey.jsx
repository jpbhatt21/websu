import { settings } from "../SettingsValues";
function SettingsKey({props}) {
    return ( <>
   <div className="w-full flex items-center justify-end h-1/2 ">
				<input
					defaultValue={props.element.value}
                    onKeyDown={(e)=>{
                        console.log(e)
                    }}
					className="w-32 bg-ltpost h-full text-colors px-3 bg-opacity-50 backdrop-blur-sm text-center  outline-colors-bact outline-1  duration-300   flex items-center justify-center  overflow-hidden  outline  rounded-md "
					style={{
						backgroundColor: !settings.User_Interface["UI_BackDrop"].value ? "#2a2a2a" : "",
						backdropFilter: !settings.User_Interface["UI_BackDrop"].value ? "blur(0px)" : "",
						WebkitBackdropFilter: !settings.User_Interface["UI_BackDrop"].value ? " blur(0px) " : "",
					}}>
					
				</input>
			</div>
    </> );
}

export default SettingsKey;