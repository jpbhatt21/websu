import { settings } from "../SettingsValues";
let credits = [
	{
		prop: "Beatmap Mirror",
		val: "Mino",
		link: "https://catboy.best/",
        icon:"/mino.webp"
	},
	{
		prop: "Intro Music",
		val: "triangles (osu!lazer) - cYsmix",
		link: "https://soundcloud.com/olemlanglie/cysmix-triangles-osulazer",
        icon:"/cysmix.jpg"
	},
	{
		prop: "Intro Sequence",
		val: "Inspired by the osu! lazer 'triangles' intro sequence",
		link: "https://x.com/ppy/status/1161276183998160898?s=09",
        icon:"/Osu.png"
	},
	{
		prop: "Getting Comfortable with Beziers",
		val: "Pomax",
		link: "https://pomax.github.io/bezierinfo/",
        icon:"/pomax.png"
	},
	{
		prop: "Icons",
		val: "SVG Repo",
		link: "https://www.svgrepo.com/",
        icon:"/svgrepo.png"
	},
	{
		prop: "And...",
		val: "peppy",
		link: "https://github.com/peppy",
        icon:"/ppy.png"
	},
];
function Credits({ props = { scale: 1 } }) {
	return (
		<div
			className="fixed w-full h-full pointer-events-auto"
			onClick={(e) => {
				if (e.currentTarget == e.target) {
					e.preventDefault();
					creditsButton.click();
				}
			}}
            style={{
                
                paddingTop: 60 * props.scale + "px",
              
            }}
            >
			<div
				id="creditsPage"
				className="slide-in-back overflow-y-scroll absolute right-0 border-l border-[#636363] justify -center  pointer-events-auto h-full duration-300 transition-all flex flex-col bg-opacity-50 bg-post backdrop-blur-md"
				style={{
					backgroundColor: !settings.User_Interface.UI_BackDrop.value
						? "#252525"
						: "",
					paddingTop: 60 * props.scale + "px",
					paddingBottom: 60 * props.scale + "px",

					width:
						Math.min(window.innerWidth, 560 * props.scale) + "px",
				}}>
				<div
					className="w-full h-32 lexend text-center "
					style={{
						color: "#fff",
						height: 60 * props.scale + "px",
						fontSize: 30 * props.scale + "px",
					}}>
					Credits
				</div>
				<div
					className="w-full  flex flex-col text-bact"
					style={{
						fontSize: 20 * props.scale + "px",
						lineHeight: 24 * props.scale + "px",
						gap: 32 * props.scale + "px",
                        paddingTop: 60 * props.scale + "px",
						padding: 20 * props.scale + "px",
					}}>
					{credits.map((x,i) => (
						<div className="w-full flex flex-col"
                        style={{
						gap: 8 * props.scale + "px",
                        }}
                        key={"credits"+i}
                        >
							<div >{x.prop}</div>
							<div className="flex items-center" style={{fontSize: 18 * props.scale + "px",lineHeight: 20 * props.scale + "px",gap: 10 * props.scale + "px",paddingLeft: 8 * props.scale + "px",}}>
                               <img className=" rounded-full" style={{height:30*props.scale+"px"}} src={x.icon}></img> <a className=" text-light-300" target="blank" href={x.link}>{x.val}</a>
                                </div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Credits;
