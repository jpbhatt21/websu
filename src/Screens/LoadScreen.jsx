import { svg } from "../Utility/VectorGraphics";

function LoadScreen({start}) {
    return ( <div
        style={{ opacity: start ? 1 : 0 }}
        id="load"
        className="w-full opacity-0 duration-300 flex items-center justify-center z-30 pointer-events-none h-full fixed bg-black bg-opacity-25 ">
        <div className=" text-bact text-[30px] font-bold bg-bcol  shadow-md border border-[#777] bg-opacity-25 rounded-lg p-3">
            {svg.loaderIcon}
        </div>
    </div> );
}

export default LoadScreen;