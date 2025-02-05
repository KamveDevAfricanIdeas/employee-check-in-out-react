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
  const [currentUser, setCurrentUser] = useState("Kamve Gwijana");
  const functionUrl = 'http://localhost:7071/api/CosmosDBFunction';
  
  const updateTime = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const timerId = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(timerId);
  }, []);
  //get the list of employees:
  useEffect(() => {
    fetch(functionUrl)
      .then((response) => response.json())
      .then((data) => {
        setList(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  const Display = async () => {
    console.log(employeeList);
  };
  
  const Checkin = async (newCheckin) => {
    try {
      const response = await fetch(functionUrl, {
        method: "POST",
        body: JSON.stringify(newCheckin),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setCheckinTime(currentTime.toLocaleTimeString());
      alert('Successfully checked in!');
      console.log("Check-in successful:", data);

    } catch (error) {
      alert('Failed to check in!');
      console.error("Error during check-in:", error);
    }
  };
  const handleCheckin = () => {
    const newCheckin = {
      id: "5",
      EmployeeId: "E004",
      EmployeeName: "John Doe",
      CheckTime: formattedTime,
    };
    Checkin(newCheckin);
  }

  const Checkout = async (newCheckout) => {
    try {
      const response = await fetch(functionUrl, {
          method: 'PUT',
          body: JSON.stringify(newCheckout),
          headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error from React Side! Status: ${response.status}`);
      }

      const data = await response.json();
      //setCheckoutTime(currentTime.toLocaleTimeString());
      console.log("Check-out: ", data);
      console.log(newCheckout);
    } catch(error){
      console.log(error);
      console.log(newCheckout);
    }
    
  };
  const handleUpdate = () => {
    const newCheckout = {
      id: "1",
      EmployeeId: "E003",
      EmployeeName: currentUser,
      CheckTime: formattedTime,
    };
    Checkout(newCheckout);
  };

  return (
    <>
        <HeaderNavBar />
        <DropdownMenu list={employeeList}/>
        <div>
          <strong>Your Details: </strong>
          {employeeList.map( (employee) => (
            <div>
              <p key={employee.id}>Name: {currentUser}</p>
              <p key={employee.id}>Employee Number: {employee.EmployeeId}</p>
              <p key={employee.id}>Last Check in: {employee.CheckTime}</p>
            </div>
          ))}
          <br></br><strong>Date Time Now: {formattedDate + " " + formattedTime} </strong>
          <p> Session Check in: {checkedInTime} </p>
          <p> Session Checkout: {checkedOutTime} </p>
        </div>
        <div className="button-class">
          <button type="button" className="checkin-btn" onClick={Display}>Display</button>
          <button type="button" className="checkin-btn" onClick={handleCheckin}>Check-In</button>
          <button type="button" className="checkout-btn" onClick={handleUpdate}>Check-Out</button>
        </div>
        <FooterBar />
    </>
  )
}
export default App
