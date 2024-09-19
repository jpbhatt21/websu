
import SongSelectionMenu from './SongSelectionMenu'

export const uri="https://websu-back.jpbhatt.tech"
export const uri2="https://catboy.best"
import { useEffect, useMemo, useState } from "react";
import { BlurFilter, Circle, TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text, Graphics, useTick } from "@pixi/react";
import HitObj from './HitObj';
// window.addEventListener('resize', () => {
//   console.log('resized')
//   let stg=document.getElementById('stg')
// stg.style.width = window.innerHeight/3 * 4
// stg.style.height = window.innerHeight
// }
// )
import { Assets } from 'pixi.js'

Assets
 .load('https://pixijs.com/assets/bitmap-font/desyrel.xml')
function App() {
  
  const blurFilter = useMemo(() => new BlurFilter(2), []);
	const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
  return (
    <>
    <SongSelectionMenu/>
    </>
  )
}

export default App
