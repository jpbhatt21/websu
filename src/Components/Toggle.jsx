function Toggle({value,onClick,mode=false}) {
    return ( <div
        className={"bg-ltpost  cursor-pointer outline-bdark outline-1  duration-300   flex  items-center  outline  rounded-full aspect-video max-h-[3vh] h-5 "+(mode?"bg-opacity-50":"")}
        onClick={onClick}
        style={{
            backgroundColor: value
                ? "#555"
                : "",
        }}>
        <div
            className="bg-bdark duration-300  h-3/4 aspect-square rounded-full"
            style={{
                backgroundColor: value
                    ? "#939393"
                    : "",
                marginLeft: value ? "50%" : "5%",
            }}></div>
    </div> );
}

export default Toggle;