import { bezier } from "./PlayArea"
import { music } from "./Utility/Utils"
export const defaultSettings={
    User_Interface:{
       
        
            UI_BackDrop:{
                type: "toggle",
                value: true,
            },
            Background:{
                
                type: "list",
                options: ["Blur", "Show", "Hide"],
                value: 0,
            },
            Show_Banners:{
                
                type: "toggle",
                value: true,
            },
            Show_FPS:{
                
                type: "toggle",
                value: true,
            },
        
    },
    Audio:{
        
            "Output Device": {
                type: "list",
                options: ["Default"],
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
            "Effect Volume": {
                type: "slider",
                value: 100,
            },
            "Music Mute": {
                type: "toggle",
                value: false,
            },
            "Effect Mute": {
                type: "toggle",
                value: false,
            },
            "Audio Offset": {
                type: "slider",
                value: 50,
            },
        
    },
    Gameplay:{
        "Play Video": {
            type: "toggle",
            value: true,
        },
        "Default Cursor": {
            type: "toggle",
            value: false,
        },
        "Cursor Size": {
            type: "slider",
            value: 50,
        },
        "Beatmap Skin": {
            type: "toggle",
            value: false,
        },
        "Beatmap Hitsounds": {
            type: "toggle",
            value: false,
        },
        "Beatmap Storyboard": {
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
        "Fade To Red On Low HP": {
            type: "toggle",
            value: false,
        },
    },
    Maintainance:{
        "Clear Temp Storage": {
            type: "list",
            options: ["On Reload", "Never"],
            value: 0,
        },
        "Delete Temp Beatmaps": {
            type: "button",
        },
        "Delete All Beatmaps": {
            type: "button",
        },
        "Delete All Beatmap Videos": {
            type: "button",
        },
        "Delete All Beatmap Skins": {
            type: "button",
        },
        "Reset All Settings": {
            type: "button",
        },
    }
}
export let settings={
    User_Interface:{
       
        
            UI_BackDrop:{
                type: "toggle",
                value: true,
            },
            Background:{
                
                type: "list",
                options: ["Blur", "Show", "Hide"],
                value: 0,
            },
            Show_Banners:{
                
                type: "toggle",
                value: true,
            },
            Show_FPS:{
                
                type: "toggle",
                value: true,
            },
        
    },
    Audio:{
        
            "Output Device": {
                type: "list",
                options: ["Default"],
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
            "Effect Volume": {
                type: "slider",
                value: 100,
            },
            "Music Mute": {
                type: "toggle",
                value: false,
            },
            "Effect Mute": {
                type: "toggle",
                value: false,
            },
            "Audio Offset": {
                type: "slider",
                value: 50,
            },
        
    },
    Gameplay:{
        "Play Video": {
            type: "toggle",
            value: true,
        },
        "Default Cursor": {
            type: "toggle",
            value: false,
        },
        "Cursor Size": {
            type: "slider",
            value: 50,
        },
        "Beatmap Skin": {
            type: "toggle",
            value: false,
        },
        "Beatmap Hitsounds": {
            type: "toggle",
            value: false,
        },
        "Beatmap Storyboard": {
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
        "Fade To Red On Low HP": {
            type: "toggle",
            value: false,
        },
    },
    Maintainance:{
        "Clear Temp Storage": {
            type: "list",
            options: ["On Reload", "Never"],
            value: 0,
        },
        "Delete Temp Beatmaps": {
            type: "button",
        },
        "Delete All Beatmaps": {
            type: "button",
        },
        "Delete All Beatmap Videos": {
            type: "button",
        },
        "Delete All Beatmap Skins": {
            type: "button",
        },
        "Reset All Settings": {
            type: "button",
        },
    }
}
export function setSettings(val){
    music.volume=bezier((parseInt((val.Audio["Master Volume"].value*val.Audio["Music Volume"].value)/101))/100)
    music.muted=val.Audio["Music Mute"].value
    window.localStorage.setItem("settings", JSON.stringify(val))   
    settings=val
}
// if(!settingsVal.showBackground){
//     document.getElementById("backgroundImage").style.opacity=0
// }