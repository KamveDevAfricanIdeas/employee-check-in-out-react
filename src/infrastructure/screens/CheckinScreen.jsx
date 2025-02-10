import React, {useState, useEffect, useContext} from 'react';
import { EmployeeContext } from "../../App";
import { v4 as uuidv4 } from 'uuid';
import HeaderNavBar from '../../infrastructure/components/Header.jsx'
import FooterBar from '../../infrastructure/components/Footer.jsx'
import clockIcon from '../../assets/clock.png';
import breakIcon from '../../assets/coffee-break.png';
import checkoutIcon from '../../assets/right-arrow.png';
import checkinIcon from '../../assets/check-in.png';
import '../../styles/checkin.style.css';

export default function CheckinScreen() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const formattedDate = currentTime.toLocaleDateString();
    const formattedTime = currentTime.toLocaleTimeString();

    const [breakTime, setBreakTime] = useState("0hrs 0m 0s");
    const [updateItem, setUpdateData] = useState([]);
    const [insertItem, setInsertItem] = useState([]);

    const [employeeList, setList] = useState([]);
    const { selectedEmployee, userLocation } = useContext(EmployeeContext);

    const functionUrl = 'http://localhost:7071/api/CosmosDBFunction';
  
    const updateTime = () => {
      setCurrentTime(new Date());
    };
  
    useEffect(() => {
      const timerId = setInterval(updateTime, 1000); // Update every second
      return () => clearInterval(timerId);
    }, []);

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
        alert("Checked in!");
        console.log("Check-in successful:", data);
  
      } catch (error) {
        console.error("Error during check-in:", error);
      }
    };
    const handleCheckin = () => {
      if (!selectedEmployee){
        alert("No user selected!");
      }
      else{
        const items = [...insertItem, {
          id: uuidv4(),
          //when checking in, insert the current user details with a new time and id.
          EmployeeNumber: selectedEmployee.EmployeeNumber,
          EmployeeName: selectedEmployee.EmployeeName,
          CheckTime: formattedDate + " " + formattedTime,
        }];
        setInsertItem(items);
  
        const newCheckin = {
          items
        };
        console.log(newCheckin);
        //Checkin(newCheckin);
      }
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
        alert("Checked out!");
      } catch(error){
        console.log(error);
        console.log(newCheckout);
      }
      
    };
    const handleUpdate = () => {
      if (!selectedEmployee){
        alert("No user selected!");
      }
      else{
        const items = [...updateItem, {
            id: selectedEmployee.id,
            EmployeeNumber: selectedEmployee.EmployeeNumber,
            EmployeeName: selectedEmployee.EmployeeName,
            CheckoutTime: formattedDate + " " + formattedTime
        }];
        setUpdateData(items);
        const newCheckout = {
          items
        };
        console.log(newCheckout);
        //Checkout(newCheckout);
      }
    };
    return(
        <>
            <HeaderNavBar username={selectedEmployee ? selectedEmployee.EmployeeName : "Getting information ..."}/>
            <button type="button" onClick={() => 
                    { 
                        console.log(selectedEmployee.EmployeeName);
                        console.log(selectedEmployee.id);
                        console.log(selectedEmployee.EmployeeNumber);
                        /* 
                            ISSUE: When logging in, the system passes in the data from the EmployeeNames list and not the EmployeeCheckinList
                            thus we cannot read the CheckTime or CheckoutTime
                        */
                        console.log(selectedEmployee.CheckTime);
                    }
                }>testt</button>
            <div className="date-display">
                <strong>{formattedDate} </strong>
                {!userLocation ? (<p>Can't Find Location</p>) :
                (<strong>{userLocation.latitude + " " + userLocation.longitude}</strong>) }
            </div>
            <div className="user-detail-container">
                <p>Your last check in</p>
                {selectedEmployee ? ( <h5>{selectedEmployee.CheckTime}</h5>
                ) : ( <p>Can't find last check in time. Not logged in!</p> )}
            </div>
            <div className="button-class">
                <button type="button" className="activity-tool" id="checkin-btn" onClick={handleCheckin}>
                    <div className="iconContainer">
                    <img className="icons" src={checkinIcon}/>
                    </div>
                    <h4 id="tool-name-value">{formattedTime}</h4>
                    <h4 id="tool-name">Check In</h4>
                </button>
                <button type="button" className="activity-tool" id="checkout-btn" onClick={handleUpdate}>
                    <div className="iconContainer">
                    <img className="icons" src={checkoutIcon}/>
                    </div>
                    <h4 id="tool-name-value">{formattedTime}</h4>
                    <h4 id="tool-name">Check Out</h4>
                </button>
                <div className="activity-tool">
                    <div className="iconContainer">
                    <img className="icons" src={clockIcon}/>
                    </div>
                    <h4 id="tool-name-value">{breakTime}</h4>
                    <h4 id="tool-name">Active Hours</h4>
                </div>
                <div className="activity-tool">
                    <div className="iconContainer">
                    <img className="icons" src={breakIcon}/>
                    </div>
                    <h4 id="tool-name-value">{breakTime}</h4>
                    <h4 id="tool-name">Break</h4>
                </div>
            </div>
            <h4>Comments</h4>
            <div className="comment-container">  
                <input className="comment-input" placeholder="..."></input>
                <button className="comment-btn" type="button">Send</button>
            </div>
            <FooterBar />
        </>
    )
}