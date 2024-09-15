import { useState } from 'react'
import SongSelectionMenu from './SongSelectionMenu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SongSelectionMenu />
    </>
  )
}

export default App
