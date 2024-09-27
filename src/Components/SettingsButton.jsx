function SettignsButton({ y, backdrop,setFun }) {
	return (
		<>
			<div className="w-full flex items-center justify-end h-1/2 ">
				<button
					onClick={() => {
                        if(y.title=="Unavailable")
                            return
						setFun(y);
					}}
					className="w-32 bg-ltpost h-full text-colors px-3 bg-opacity-50 backdrop-blur-sm text-center  outline-colors-red outline-1  duration-300   flex items-center justify-center  overflow-hidden  outline  rounded-md "
					style={{
						backgroundColor: !backdrop ? "#2a2a2a" : "",
						backdropFilter: !backdrop ? "blur(0px)" : "",
						WebkitBackdropFilter: !backdrop ? " blur(0px) " : "",
					}}>
					{y.title}
				</button>
			</div>
		</>
	);
}

export default SettignsButton;
