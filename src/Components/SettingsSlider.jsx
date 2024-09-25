import { useState } from "react";

function SettingsSlider({index,value,selecterSelecter}) {
    return ( <>
     <input type="range" min="1" max="100"defaultValue={value}
     onChange={(e)=>{
            selecterSelecter(index,parseInt(e.target.value))
     }}
     className="  rounded-full  duration-100 bg- ltpost outline-none slider h-1"
    
     />
    </> );
}

export default SettingsSlider;