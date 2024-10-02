import { bezier } from "./Screens/PlayArea";
import { music } from "./Utility/Utils";
let functions = {
	"Restore Default Settings": () => {
		setSettings(defaultSettings);
		window.location.reload();
	},
	"Delete Temp Beatmaps": () => {
		clearDatabase("tempWebsu");
	},
	"Delete All Beatmaps": () => {
		clearDatabase("websu");
	},
};
export const defaultSettings = {
	User_Interface: {
		Toggle_Fullscreen: {
			type: "list",
			options: ["TODO","Always", "During Gameplay", "Never"],
			value: 0,
		},
		UI_Scale: {
			type: "list",
			options: ["Auto", 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5,3],
			value: 0,
		},
		UI_BackDrop: {
			type: "toggle",
			value: true,
		},
		Background: {
			type: "list",
			options: ["Blur", "Show"],//"Hide"],
			value: 0,
		},
		Show_Banners: {
			type: "toggle",
			value: true,
		},
		Show_FPS: {
			type: "toggle",
			value: true,
		},
		
	},
	Audio: {
		"Output Device": {
			type: "list",
			options: ["TODO"],//"Default"],
			value: 0,
		},
		"Master Volume": {
			type: "slider",
			value: 100,
		},
		"Master Volume (Window Inactive)": {
			type: "slider",
			value: 30,
		},
		"Music Volume": {
			type: "slider",
			value: 100,
		},
		"TODO-Effect Volume": {
			type: "slider",
			value: 100,
		},
		"Music Mute": {
			type: "toggle",
			value: false,
		},
		"TODO-Effect Mute": {
			type: "toggle",
			value: false,
		},
		"Audio Offset": {
			type: "slider",
			value: 50,
		},
	},
	Gameplay: {
		"Play Video": {
			type: "toggle",
			value: true,
		},
		"TODO-Default Cursor": {
			type: "toggle",
			value: false,
		},
		"TODO-Cursor Size": {
			type: "slider",
			value: 50,
		},
		"TODO-Beatmap Skin": {
			type: "toggle",
			value: false,
		},
		"TODO-Beatmap Hitsounds": {
			type: "toggle",
			value: false,
		},
		"TODO-Beatmap Storyboard": {
			type: "toggle",
			value: false,
		},
		"Background Dim": {
			type: "slider",
			value: 50,
		},
		"Background Blur": {
			type: "slider",
			value: 0,
		},
		"TODO-Fade To Red On Low HP": {
			type: "toggle",
			value: false,
		},
	},
	Key_Bindings:{
		"TODO":{
			type:"Subheading"
		},
		// "Gameplay":{
		// 	type:"Subheading"
		// },
		// "Pause":{
		// 	type:"key",
		// 	value:"Space",
		// 	alternate:"Esc"
		// },
		// "Menu":{
		// 	type:"Subheading"
		// },
		// "Toggle Settings": {
		// 	type: "key",
		// 	value: "S",
		// 	modifier:"Alt"
		// },
		// "Toggle Online Mode":{
		// 	type: "key",
		// 	value: "O",
		// 	modifier:"Alt"
		// },
		// "Toggle Delete Mode":{
		// 	type: "key",
		// 	value: "X",
		// 	modifier:"Alt"
		// },
		// "Mute Music": {
		// 	type: "key",
		// 	value: "M",
		// 	modifier:"Alt"
		// },
		// "Pause Music": {
		// 	type: "key",
		// 	value: "P",
		// 	modifier:"Alt"
		// },
		// "Panic Restore Default Settings": {
		// 	type: "key",
		// 	value: "`",
		// 	modifier:"Alt+Shift"
		// },
		
	},
	Maintainance: {
		"Clear Temp Storage": {
			type: "list",
			options: ["On Reload", "Never"],
			value: 0,
		},
		"Delete Temp Beatmaps": {
			type: "button",
			title: "Delete",
		},
		"Delete All Beatmaps": {
			type: "button",
			title: "Delete",
		},
		"TODO-Delete All Beatmap Videos": {
			type: "button",
			title: "Unavailable",
		},
		"TODO-Delete All Beatmap Skins": {
			type: "button",
			title: "Unavailable",
		},
		"Restore Default Settings": {
			type: "button",
			title: "Reset",
		},
	},
};

function clearDatabase(prefix) {
	const request2 = indexedDB.open(prefix + "Storage", 2);
	request2.onupgradeneeded = function (event) {
		const db = event.target.result;
		let objectStore = db.createObjectStore("Files", {
			keyPath: "setId",
		});
		objectStore = db.createObjectStore("Assets", {
			keyPath: "setId",
		});
		objectStore = db.createObjectStore("Meta", {
			keyPath: "setId",
		});
		objectStore = db.createObjectStore("Preview", {
			keyPath: "setId",
		});
	};
	request2.onsuccess = function (event) {
		let db = event.target.result;
		let transaction = db.transaction("Meta").objectStore("Meta").getAll();
		transaction.onsuccess = function (event) {
			if (event.target.result.length > 0) {
				indexedDB.deleteDatabase(prefix + "Storage");
			} else {
				console.log("No data to clear");
			}
		};
	};
}
export let settings = JSON.parse(JSON.stringify(defaultSettings));
settings.Maintainance["Restore Default Settings"].function =
	functions["Restore Default Settings"];
settings.Maintainance["Delete Temp Beatmaps"].function =
	functions["Delete Temp Beatmaps"];
settings.Maintainance["Delete All Beatmaps"].function =
	functions["Delete All Beatmaps"];
export function setSettings(val) {
	if(music){
		music.volume = bezier(
			parseInt(
				(val.Audio["Master Volume"].value *
					val.Audio["Music Volume"].value) /
					101
			) / 100
		);
		music.muted = val.Audio["Music Mute"].value;
	}
	window.localStorage.setItem("settings", JSON.stringify(val));
	let keys = Object.keys(settings);
	for (let i in keys) {
		if (keys[i] != "Maintainance") {
			let subKeys = Object.keys(settings[keys[i]]);
			for (let j in subKeys) {
				try{
					settings[keys[i]][subKeys[j]].value =
						val[keys[i]][subKeys[j]].value;
				}
				catch(e){
				
				}
			}
		}
		else
			settings.Maintainance["Clear Temp Storage"] =
				val.Maintainance["Clear Temp Storage"];
	}
}
// if(!settingsVal.showBackground){
//     document.getElementById("backgroundImage").style.opacity=0
// }
