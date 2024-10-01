import { useEffect, useState } from "react";
import { settings } from "../SettingsValues";
import SettingsScreen from "./SettingsScreen";
import MessageBox from "../Components/MessageBox";
import TopBar from "../Components/TopBar";
import { useWindowDimensions } from "../Utility/Utils";
import Confirm from "./ConfirmDeleteScreen";
import SongSelectionMenu from "./SongSelectionScreen";
import HomeScreen from "./HomeScreen";

function MainScreen({startApp}) {
	const { height, width } = useWindowDimensions();
	let scale = settings.User_Interface.UI_Scale.value;
	if (scale == 0) {
		scale = height / 942;
	} else {
		scale = settings.User_Interface.UI_Scale.options[scale];
	}
	const [showTopBar, setShowTopBar] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [updateOnSettingChange, changeSettings] = useState(0);
	const [resetFunction, setResetFunction] = useState(null);
    const [addSongMenuEventListener,setAddSongMenuEventListener]=useState(false)
    const [showHome,setShowHome]=useState(true)
    const [initLoad,setInitLoad]=useState(true)
	const [savedHomeScreenColor,setSavedHomeScreenColor]=useState(null)
    useEffect(()=>{
        if(addSongMenuEventListener && initLoad)
            setInitLoad(false)
    },[addSongMenuEventListener])
	return (
		<>
            {<SongSelectionMenu props={{addSongMenuEventListener,showTopBar:(addSongMenuEventListener&&showTopBar),setShowHome,setAddSongMenuEventListener,setShowTopBar}} />}
            {startApp?
            <>
            {showHome?<HomeScreen props={{setShowHome,setAddSongMenuEventListener,setShowTopBar,initLoad,showTopBar,savedHomeScreenColor,setSavedHomeScreenColor}} />:<></>}
            {showSettings ? (
				<SettingsScreen
					setUpdateSettings={changeSettings}
					setFun={setResetFunction}
					scale={scale}
				/>
			) : (
				<></>
			)}
			<TopBar
				props={{ scale, showTopBar, showSettings, setShowSettings }}
			/>
			<MessageBox
				downloadHead={0}
				downloadQueue={0}
				unzipCounter={0}
				unzipTotal={0}
				showFps={settings.User_Interface.Show_FPS.value}
			/>
			{resetFunction ? (
				<Confirm props={{ resetFunction, setResetFunction }} />
			) : (
				<></>
			)}
            </>
            
            :<></>}
			
		</>
	);
}

export default MainScreen;
