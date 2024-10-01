function SettingsSlider({ props }) {
	return (
		<>
			<input
				type="range"
				min="1"
				max="100"
				defaultValue={props.value}
				onChange={(e) => {
					props.selecterSelecter(
						props.index,
						parseInt(e.target.value)
					);
				}}
				className="  rounded-full  duration-100 bg- ltpost outline-none slider "
			/>
		</>
	);
}

export default SettingsSlider;
