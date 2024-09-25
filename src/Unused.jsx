<div
	onClick={() => {
		setFocus(!focus);
	}}
	style={{
		opacity: focus ? 0 : 1,
		pointerEvents: focus ? "none" : "auto",
		filter: focus ? "blur(0px)" : "",
	}}
	id="load2"
	className="w-full  duration-300 text-bcol flex items-center justify-center z-40 h-full fixed bg-black bg-opacity-50  backdrop-blur-md ">
	<div className="text-xl font-bold bg-black ">Click to Start</div>
</div>;
