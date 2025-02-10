import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/loginscreen.style.css';
import DropdownMenu from '../components/Dropdown';
import { EmployeeContext } from "../../App.jsx";

export default function LoginScreen() {
    const [employeeList, setList] = useState([]);
    const [checkinList, setCheckinList] = useState([]);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    const navigate = useNavigate();
    const { setSelectedEmployee, setUserLocation } = useContext(EmployeeContext);
    const functionUrl = 'http://localhost:7071/api/CosmosDBFunction';

    //get the list of employees:
    useEffect(() => {
        fetch(functionUrl)
        .then((response) => response.json())
        .then((data) => {
            setList(data.getEmployees);
            setCheckinList(data.items);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const LoginUser = () => {
        if (navigator.geolocation) {
            setIsFetchingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationData = { latitude, longitude };

                    setUserLocation(locationData);
                    localStorage.setItem("userLocation", JSON.stringify(locationData)); // Save immediately
                    setUserLocation({ latitude, longitude });
                    setIsFetchingLocation(false);
                    if (passwordInput === "123DevTeam") {
                        navigate("/checkin");
                    } else {
                        alert("Incorrect Password!");
                    }
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    setIsFetchingLocation(false);
                }
          );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
      };

    return (
        <>
            <div className="login-container">
                <div className="login-tools">
                    <DropdownMenu 
                        list={employeeList}
                        checkinList={checkinList}
                        setSelectedEmployee={setSelectedEmployee}
                        setUserLocation={setUserLocation}
                    />
                    <input type="password" placeholder="Enter password" className="password-input" 
                        value={passwordInput} // Controlled input
                        onChange={(e) => setPasswordInput(e.target.value)} // Update state on input change
                    />
                    <button
                        className="login-btn"
                        onClick={LoginUser}
                        disabled={isFetchingLocation} // Disable button while fetching location
                    >
                        {isFetchingLocation ? "Please wait ..." : "Login"}
                    </button>
                </div>
            </div>
        </>
    );
}