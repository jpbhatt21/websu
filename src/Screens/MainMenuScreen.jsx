import { useEffect, useState } from "react";
import { settings } from "../SettingsValues";
import SettingsScreen from "./SettingsScreen";
import MessageBox from "../Components/MessageBox";
import TopBar from "../Components/TopBar";
import { useWindowDimensions } from "../Utility/Utils";
import Confirm from "./ConfirmDeleteScreen";
import SongSelectionMenu from "./SongSelectionScreen";
import HomeScreen from "./HomeScreen";
import LoadScreen from "./LoadScreen";
import PauseScreen from "./PauseScreen";
import PlayArea from "./GamePlayScreen";

function MainScreen({ startApp }) {
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
				<SongSelectionMenu
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
							extraProps={{ setShowLoading, setShowPause }}
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
						<LoadScreen
							props={{ showLoadingScreen: showLoading }}
						/>
					) : (
						<></>
					)}
					{showHome ? (
						<HomeScreen
							props={{
								setShowHome,
								setShowSongMenu,
								setShowTopBar,
								initLoad,
								showTopBar,
								savedHomeScreenColor,
								showSettings,
								setSavedHomeScreenColor,
							}}
						/>
					) : (
						<></>
					)}
					{showSettings ? (
						<SettingsScreen
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
						<Confirm props={{ resetFunction, setResetFunction }} />
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

export default MainScreen;
