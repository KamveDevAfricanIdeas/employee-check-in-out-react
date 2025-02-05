import { useState, useEffect } from 'react'
import './App.css'
import DropdownMenu from './infrastructure/components/Dropdown.jsx'
import HeaderNavBar from './infrastructure/components/Header.jsx'
import FooterBar from './infrastructure/components/Footer.jsx'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedInTime, setCheckinTime] = useState("");
  const [checkedOutTime, setCheckoutTime] = useState("");
  const [employeeList, setList] = useState([]);
  const functionUrl = 'http://localhost:7071/api/CosmosDBFunction';

  const updateTime = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const timerId = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    fetch(functionUrl) // Replace with your API URL
      .then((response) => response.json())
      .then((data) => {
        setList(data); // Set the array from fetched JSON data
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  //Actions for the onClick events: Checkin and Checkout:
  const Display = async () => {
    console.log(employeeList);
  };
  const Checkin = async (newCheckin) => {
    const response = await fetch(functionUrl, {
        method: 'POST',
        body: JSON.stringify(newCheckin),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log("Check-in: ", data);
  };

  const Checkout = async (newCheckout) => {
    const response = await fetch(functionUrl, {
        method: 'PUT',
        body: JSON.stringify(newCheckout),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log("Check-out: ", data);
  };

  function basicCheckIn() {
    setCheckinTime(currentTime.toLocaleTimeString());
    alert('Successfully checked in!');
  }
  function basicCheckOut() {
    setCheckoutTime(currentTime.toLocaleTimeString());
    alert('Successfully checked out!');
  }

  return (
    <>
        <HeaderNavBar />
        <DropdownMenu list={employeeList}/>
        <div>
          <strong>Date Time Now: {formattedDate + " " + formattedTime} </strong>
          <p> Last checkin: {checkedInTime} </p>
          <p> Last checkout: {checkedOutTime} </p>
        </div>
        <div className="button-class">
          <button type="button" className="checkin-btn" onClick={Display}>Display</button>
          <button type="button" className="checkin-btn" onClick={Checkin}>Check-In</button>
          <button type="button" className="checkout-btn" onClick={basicCheckOut}>Check-Out</button>
        </div>
        <FooterBar />
    </>
  )
}
export default App
