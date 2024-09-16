import { useState } from 'react'
import SongSelectionMenu from './SongSelectionMenu'
export const uri="https://websu-back.jpbhatt.tech"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SongSelectionMenu />
    </>
  )
}

export default App
