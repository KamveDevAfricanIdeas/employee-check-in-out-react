import { useState } from 'react'
import './App.css'
import DropdownMenu from './infrastructure/components/Dropdown.jsx'

function App() {
  const [count, setCount] = useState(0)

  function CheckIn() {
    alert('Successfully checked in!');
  }
  function CheckOut() {
    alert('Successfully checked out!');
  }

  return (
    <>
      <DropdownMenu/>
      <div className="button-class">
        <button type="button" onClick={CheckIn}>Check-In</button>
        <button type="button" onClick={CheckOut}>Check-Out</button>
      </div>
    </>
  )
}
export default App
