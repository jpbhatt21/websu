import { settings } from "../SettingsValues";

function Toggle({props,title}) {
    return ( <div
        className={"bg-ltpost  cursor-pointer outline-bdark outline-1  duration-300   flex  items-center  outline  rounded-full aspect-video  h-1/3 "+(settings.User_Interface["UI_BackDrop"].value?"bg-opacity-50":"")}
        id={title?title:""}
        onClick={props.onClick}
        style={{
            backgroundColor: props.value
                ? "#555"
                : "",
        }}>
        <div
            className="bg-bdark duration-300  h-3/4 aspect-square rounded-full"
            style={{
                backgroundColor: props.value
                    ? "#939393"
                    : "",
                marginLeft: props.value ? "50%" : "5%",
            }}></div>
    </div> );
}

export default Toggle;