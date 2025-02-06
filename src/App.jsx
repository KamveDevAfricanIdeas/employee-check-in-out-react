import { useState, useEffect } from 'react'
import './App.css'
import { v4 as uuidv4 } from 'uuid';
import DropdownMenu from './infrastructure/components/Dropdown.jsx'
import HeaderNavBar from './infrastructure/components/Header.jsx'
import FooterBar from './infrastructure/components/Footer.jsx'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedInTime, setCheckinTime] = useState("");
  const [checkedOutTime, setCheckoutTime] = useState("");
  const [employeeList, setList] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
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
        setCurrentUser([
          ...currentUser, 
          { userName: data[0].EmployeeName, 
            userNum: data[0].EmployeeId, 
            userCheckTime: data[0].CheckTime} ]);
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

      console.log(newCheckin);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setCheckinTime(currentTime.toLocaleTimeString());
      console.log("Check-in successful:", data);

    } catch (error) {
      console.error("Error during check-in:", error);
    }
  };
  const handleCheckin = () => {
    const newCheckin = {
      id: "3",
      //when checking in, insert the current user details with a new time and id.
      EmployeeId: "E003", //currentUser[0].userNum,
      EmployeeName: "Kamve Gwijana",//currentUser[0].userName,
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
          {/* <p key={uuidv4()}>Name: {currentUser[0].userName}</p> */}
          {/* <p key={uuidv4()}>Employee Number: {currentUser[0].userNum}</p> */}
          {/* <p key={uuidv4()}>Last Check in: {currentUser[0].userCheckTime}</p> */}
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
