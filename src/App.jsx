import { useState, useEffect } from 'react'
import './App.css'
import DropdownMenu from './infrastructure/components/Dropdown.jsx'
import HeaderNavBar from './infrastructure/components/Header.jsx'
import FooterBar from './infrastructure/components/Footer.jsx'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedInTime, setCheckinTime] = useState("");
  const [checkedOutTime, setCheckoutTime] = useState("");

  const updateTime = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const timerId = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(timerId);
  }, []);
  
  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  //connect to CosmosDB and fetch data:
  //const functionUrl = 'https://<your-function-app-name>.azurewebsites.net/api/CosmosDBFunction';
  
  const functionUrl = 'http://localhost:7071/api/CosmosDBFunction';
  const fetchData = async () => {
      const response = await fetch(functionUrl);
      const data = await response.json();
      console.log(data);
  };

  //Actions for the onClick events: Checkin and Checkout:
  const Display = async () => {
    const response = await fetch(functionUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log("Employees: ", data);
    //data[0].EmployeeName
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

  function CheckIn() {
    setCheckinTime(currentTime.toLocaleTimeString());
    alert('Successfully checked in!');
  }
  function CheckOut() {
    setCheckoutTime(currentTime.toLocaleTimeString());
    alert('Successfully checked out!');
  }

  return (
    <>
        <HeaderNavBar />
        <DropdownMenu />
        <div>
          <strong>Date Time Now: {formattedDate + " " + formattedTime} </strong>
          <p> Last checkin: {checkedInTime} </p>
          <p> Last checkout: {checkedOutTime} </p>
        </div>
        <div className="button-class">
          <button type="button" className="checkin-btn" onClick={Display}>Display</button>
          <button type="button" className="checkin-btn" onClick={CheckIn}>Check-In</button>
          <button type="button" className="checkout-btn" onClick={CheckOut}>Check-Out</button>
        </div>
        <FooterBar />
    </>
  )
}
export default App
