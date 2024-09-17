import { useState } from 'react'
import SongSelectionMenu from './SongSelectionMenu'
export const uri="https://websu-back.jpbhatt.tech"
export const uri2="https://catboy.best"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SongSelectionMenu />
    </>
  )
}

export default App
