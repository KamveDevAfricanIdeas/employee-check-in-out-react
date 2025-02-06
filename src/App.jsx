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
  const [selectedUser, setSelectedUser] = useState(null);

  const functionUrl = 'http://localhost:7071/api/CosmosDBFunction';
  
  const handleSelectedUser = (employee) => {
    setSelectedUser(employee);
  };

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
          { 
            userId: data[1].id,
            userName: data[1].EmployeeName, 
            userNum: data[1].EmployeeId, 
            userCheckTime: data[1].CheckTime
          } ]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  const Display = async () => {
    console.log(employeeList);
    console.log("Current User");
    console.log(currentUser[0].userName);
    console.log(currentUser[0].userNum);
    console.log(currentUser[0].userCheckTime);
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
      id: uuidv4(),
      //when checking in, insert the current user details with a new time and id.
      EmployeeId: currentUser[0].userNum, 
      EmployeeName: currentUser[0].userName,
      CheckTime: formattedDate + " " + formattedTime,
    };
    console.log("Unique Id: ", uuidv4());
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
      console.log("Check-out: ", data);
      console.log(newCheckout);
    } catch(error){
      console.log(error);
      console.log(newCheckout);
    }
    
  };
  const handleUpdate = () => {
    const newCheckout = {
      id: currentUser[0].userId,
      EmployeeId: currentUser[0].userNum,
      EmployeeName: currentUser[0].userName,
      CheckTime: formattedDate + " " + formattedTime,
    };
    Checkout(newCheckout);
  };

  return (
    <>
        <HeaderNavBar />
        {/* <h1>{selectedUser.EmployeeName}</h1> */}
        <DropdownMenu list={employeeList} />
          <br></br><strong>Date Time Now: {formattedDate + " " + formattedTime} </strong><br></br>
        <div className="button-class">
          {/* <button type="button" className="checkin-btn" onClick={Display}>Display</button> */}
          <button type="button" className="checkin-btn" onClick={handleCheckin}>Check-In</button>
          <button type="button" className="checkout-btn" onClick={handleUpdate}>Check-Out</button>
        </div>
        <FooterBar />
    </>
  )
}
export default App
