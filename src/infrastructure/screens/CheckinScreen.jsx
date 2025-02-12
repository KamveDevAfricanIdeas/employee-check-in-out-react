import React, {useState, useEffect, useContext} from 'react';
import { EmployeeContext } from "../../App";
import { v4 as uuidv4 } from 'uuid';
import HeaderNavBar from '../../infrastructure/components/Header.jsx'
import FooterBar from '../../infrastructure/components/Footer.jsx'
import PopupComponent from '../components/Popup.jsx';
import clockIcon from '../../assets/clock.png';
import breakIcon from '../../assets/coffee-break.png';
import checkoutIcon from '../../assets/right-arrow.png';
import checkinIcon from '../../assets/check-in.png';
import '../../styles/checkin.style.css';
//==============================================================================================================================//
export default function CheckinScreen() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const formattedDate = currentTime.toLocaleDateString();
    const formattedTime = currentTime.toLocaleTimeString();
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [activityTime, setActivityTime] = useState(0);
    const [breakTime, setBreakTime] = useState(0);
    const [checkedIn, setIsCheckedIn] = useState(false);
    const { selectedEmployee, userLocation } = useContext(EmployeeContext);
    const functionUrl = 'http://localhost:7071/api/CosmosDBFunction';
    const updateTime = () => {
      setCurrentTime(new Date());
    };
//==============================================================================================================================//
    useEffect(() => {
      const timerId = setInterval(updateTime, 1000); // Update every second
      return () => clearInterval(timerId);
    }, []);

    //HANDLE THE ACTIVITY CLOCK:
    useEffect(() => {
      let interval;
      if (isRunning) {
        interval = setInterval(() => {
          setActivityTime((prevTime) => prevTime + 1);
        }, 1000);
      } else {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [isRunning]);
    useEffect(() => {
      let interval;
      if (isBreak) {
        interval = setInterval(() => {
          setBreakTime((prevTime) => prevTime + 1);
        }, 1000);
      } else {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [isBreak]);

    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${h}hrs ${m}m ${s}s`;
    };
    //SAVE YOUR RUNNING STATE:
    useEffect(() => {
      const saveRunningState = localStorage.getItem("isRunning");
      if (saveRunningState) {
        setIsRunning(JSON.parse(saveRunningState));
      }
    }, []);
    useEffect(() => {
      if (isRunning) {
        localStorage.setItem("isRunning", JSON.stringify(isRunning));
      } else {
        localStorage.removeItem("isRunning");
      }
    }, [isRunning]);
    //SAVE YOUR ACTIVITY TIME:
    useEffect(() => {
      const savedActiveTime = localStorage.getItem("activityTime");
      if (savedActiveTime) {
        setActivityTime(JSON.parse(savedActiveTime));
      }
    }, []);
    useEffect(() => {
      if (activityTime) {
        localStorage.setItem("activityTime", JSON.stringify(activityTime));
      } else {
        localStorage.removeItem("activityTime");
      }
    }, [activityTime]);

    //SAVE THE Checkin Status of the user.
    useEffect(() => {
      const savedCheckinStatus = localStorage.getItem("checkedIn");
      if (savedCheckinStatus) {
        setIsCheckedIn(JSON.parse(savedCheckinStatus));
      }
    }, []);
    useEffect(() => {
      if (checkedIn) {
        localStorage.setItem("checkedIn", JSON.stringify(checkedIn));
      } else {
        localStorage.removeItem("checkedIn");
      }
    }, [checkedIn]);
//==============================================================================================================================//
    const clearActivityTime = () => {
      localStorage.removeItem("isRunning"); // Clear employee data
      localStorage.removeItem("activityTime"); // Clear location data
      setIsRunning(false); // Reset state
      setActivityTime(0); // Reset state
    };
    const clearBreakTime = () => {
      localStorage.removeItem("isBreak");
      localStorage.removeItem("breakTime");
      setIsBreak(false);
      setBreakTime(0);
    };
//==============================================================================================================================//
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
      const newCheckin = {
        items : {
          id: uuidv4(),
          EmployeeNumber: selectedEmployee.EmployeeNumber,
          EmployeeName: selectedEmployee.EmployeeName,
          CheckTime: formattedDate + " " + formattedTime,
          isCheckedIn: "true"
        }
      };
      setIsCheckedIn(true);
      setIsRunning(true);
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
        alert("Checked out!");
      } catch(error){
        console.log(error);
        console.log(newCheckout);
      }
      
    };
    const handleUpdate = () => {
      const newCheckout = {
        items: {
          id: selectedEmployee.id,
          EmployeeNumber: selectedEmployee.EmployeeNumber,
          EmployeeName: selectedEmployee.EmployeeName,
          CheckoutTime: formattedDate + " " + formattedTime,
          isCheckedIn: "false",
          ActivityTime: formatTime(activityTime)
        }
      };
      clearActivityTime();
      clearBreakTime();
      setIsCheckedIn(false);
      Checkout(newCheckout);
    };
    const HandleBreakTime = () => {
      setIsRunning(!isRunning);
      setIsBreak(!isBreak);
    };
//==============================================================================================================================//
    return(
        <>
          <HeaderNavBar username={selectedEmployee ? selectedEmployee.EmployeeName : "Getting information ..."}/>
          <div className="date-display">
              <strong>{formattedDate} </strong>
{/*                 {!userLocation ? (<p>Can't Find Location</p>) :
              (<strong>{userLocation.latitude + " " + userLocation.longitude}</strong>) } */}
          </div>
          <div className="user-detail-container">
              <p>{userLocation}</p>
          </div>
          <div className="button-class">
              <button disabled={checkedIn} type="button" className="activity-tool" id="checkin-btn" onClick={handleCheckin}>
                  <div className="iconContainer">
                  <img className="icons" src={checkinIcon}/>
                  </div>
                  <h4 id="tool-name-value">{checkedIn ? "checked in" : formattedTime}</h4>
                  <h4 id="tool-name">Check In</h4>
              </button>
              <button disabled={!checkedIn} type="button" className="activity-tool" id="checkout-btn" onClick={handleUpdate}>
                  <div className="iconContainer">
                  <img className="icons" src={checkoutIcon}/>
                  </div>
                  <h4 id="tool-name-value">{!checkedIn ? "checked out" : formattedTime}</h4>
                  <h4 id="tool-name">Check Out</h4>
              </button>
              <button disabled={true} type="button" className="activity-tool">
                  <div className="iconContainer">
                    <img className="icons" src={clockIcon}/>
                  </div>
                  <h4 id="tool-name-value">{formatTime(activityTime)}</h4>
                  <h4 id="tool-name">Active Hours</h4>
              </button>
              <button disabled={!checkedIn} type="button" className="activity-tool" id="checkout-btn" onClick={HandleBreakTime}>
                  <div className="iconContainer">
                  <img className="icons" src={breakIcon}/>
                  </div>
                  <h4 id="tool-name-value">{formatTime(breakTime)}</h4>
                  <h4 id="tool-name">Break</h4>
              </button>
          </div>
          <h4>Comments</h4>
          <div className="comment-container">  
              <input className="comment-input" placeholder="..."></input>
              <PopupComponent buttonLabel={"Send"} popupInfo={"Submitted a brief summary of what you did today."}/>
          </div>
          <FooterBar />
        </>
    )
}
//==============================================================================================================================//