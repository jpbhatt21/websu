import SongSelectionMenu from "./SongSelectionMenu";
import { useState } from "react";
export const uri = "https://websu-back.jpbhatt.tech";
export const uri2 = "https://catboy.best";

function App() {
	const [limit, setLimit] = useState(0);

	
	return (
		<>
		<SongSelectionMenu/>			
		</>
	);
}

export default App;
