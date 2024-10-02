import { useEffect, useState } from "react";
import { settings } from "../SettingsValues";
import Settings from "./Settings";
import MessageBox from "../Components/MessageBox";
import TopBar from "../Components/TopBar";
import { useWindowDimensions } from "../Utility/Utils";
import DeleteConfirmation from "./DeleteConfirmation";
import SongMenu from "./SongMenu";
import Home from "./Home";
import Loading from "./Loading";
import PauseScreen from "./Pause";
import PlayArea from "./PlayArea";
import Credits from "./Credits";

function ScreenManager({ startApp }) {
	const { height, width } = useWindowDimensions();
	let scale = settings.User_Interface.UI_Scale.value;
	if (scale == 0) {
		scale = height / 942;
	} else {
		scale = settings.User_Interface.UI_Scale.options[scale];
	}
	const [updateOnSettingChange, changeSettings] = useState(0);
	const [gameProp, setGameProp] = useState({});
	const [resetFunction, setResetFunction] = useState(null);
	const [showCredits,setShowCredits]=useState(false)
	const [showTopBar, setShowTopBar] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showSongMenu, setShowSongMenu] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const [showPause, setShowPause] = useState(false);
	const [showGame, setShowGame] = useState(false);
	const [showHome, setShowHome] = useState(true);
	const [initLoad, setInitLoad] = useState(true);
	const [savedHomeScreenColor, setSavedHomeScreenColor] = useState(null);
	useEffect(() => {
		if (showSongMenu && initLoad) setInitLoad(false);
	}, [showSongMenu]);
	useEffect(() => {
		if (showSongMenu && showHome) {
			songMenuTopBarAddOns.style.opacity = "0";
			setTimeout(() => {
				setShowSongMenu(false);
			}, 1000);
		}
	}, [showHome]);
	useEffect(() => {
		if (showGame) setShowLoading(true);
	}, [showGame]);
	return (
		<>
			{
				<SongMenu
					props={{
						showSongMenu,
						showTopBar: showSongMenu && showTopBar,
						setShowHome,
						setShowSongMenu,
						setShowTopBar,
						setGameProp,
						setShowGame,
					}}
				/>
			}
			{startApp ? (
				<>
					{" "}
					{showGame ? (
						<PlayArea
							props={gameProp}
							extraProps={{ setShowLoading, setShowPause,setShowTopBar,setShowSongMenu,setShowGame}}
						/>
					) : (
						<></>
					)}
					{showPause ? (
						<PauseScreen
							props={{
								setShowPause,
								setShowGame,
								setShowSongMenu,
								setShowTopBar,
							}}
						/>
					) : (
						<></>
					)}
					{showLoading ? (
						<Loading
							props={{ showLoadingScreen: showLoading }}
						/>
					) : (
						<></>
					)}
					{showHome ? (
						<Home
							props={{
								setShowHome,
								setShowSongMenu,
								setShowTopBar,
								initLoad,
								showTopBar,
								savedHomeScreenColor,
								showSettings,
								showCredits,
								setShowCredits,
								setSavedHomeScreenColor,
							}}
						/>
					) : (
						<></>
					)}
					{showCredits?<Credits props={{scale}}/>:<></>}
					{showSettings ? (
						<Settings
							props={{ changeSettings, setResetFunction, scale }}
						/>
					) : (
						<></>
					)}
					<TopBar
						props={{
							scale,
							showTopBar,
							showSettings,
							showHome,
							setShowSettings,
							setShowHome,
						}}
					/>
					<MessageBox
						props={{
							showFps: settings.User_Interface.Show_FPS.value,
						}}
					/>
					{resetFunction ? (
						<DeleteConfirmation props={{ resetFunction, setResetFunction }} />
					) : (
						<></>
					)}
				</>
			) : (
				<></>
			)}
		</>
	);
}

export default ScreenManager;
