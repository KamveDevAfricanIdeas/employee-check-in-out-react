import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/loginscreen.style.css';
import DropdownMenu from '../components/Dropdown';
import { EmployeeContext } from "../../App.jsx";
//======================================================================================================//
export default function LoginScreen() {
    const [employeeList, setList] = useState([]);
    const [checkinList, setCheckinList] = useState([]);
    const [loginData, setLoginData] = useState([]);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [locationName, setLocationName] = useState("");
    const navigate = useNavigate();
    const { setSelectedEmployee, setUserLocation } = useContext(EmployeeContext);
    const { selectedEmployee  } = useContext(EmployeeContext);
    const functionUrl = 'http://localhost:7071/api/CosmosDBFunction';

//======================================================================================================//
    //api variables to get location name
    const GetLocationName = (latitude, longitude) => {
        var api_key = 'c43751398da440fe8752fd8cbdc00a2e';
        var query = latitude + ',' + longitude;
        var api_url = 'https://api.opencagedata.com/geocode/v1/json';
        var request_url = api_url 
            + '?' 
            + 'key=' + api_key 
            + '&q=' + encodeURIComponent(query) 
            + '&pretty=1' 
            + '&no_annotations=1';
        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);
      
        request.onload = function() {
          // see full list of possible response codes:
          // https://opencagedata.com/api#codes
      
          if (request.status === 200){
            // Success!
            var data = JSON.parse(request.responseText);
            //alert(data.results[0].formatted); // print the location
            setLocationName(data.results[0].formatted);
          } else if (request.status <= 500){
            // We reached our target server, but it returned an error
      
            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log('error msg: ' + data.status.message);
            setLocationName("Can't find location name!");
          } else {
            setLocationName("Can't find location name!");
          }
        };
      
        request.onerror = function() {
          // There was a connection error of some sort
          console.log("unable to connect to server");
        };
      
        request.send();  // make the request
    };
//======================================================================================================//
    //get the list of employees:
    useEffect(() => {
        fetch(functionUrl)
        .then((response) => response.json())
        .then((data) => {
            setList(data.getEmployees);
            setCheckinList(data.items);
            setLoginData(data.loginData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const VerifyUser = (input) => {
        /* 
            ISSUE:
                If the employee checkin record doesnt exist in the contaier
                then you wont be able to login.
                Potential fix: Read from another table to get details.
        */
        if (!selectedEmployee) {
            alert("Please choose your name in the list below!");
        } else {
            loginData.some(user => {
                if (user.EmployeeNumber === selectedEmployee.EmployeeNumber) {
                    console.log("User Found!");
                    if (input === user.password) {
                        alert("Login Successful!");
                        navigate("/checkin");
                    } else {
                        alert("Incorrect password!");
                        navigate("/");
                    }
                } 
            })
        }
    };
    const LoginUser = () => {
        if (navigator.geolocation) {
            setIsFetchingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    GetLocationName(latitude, longitude);
                    setUserLocation( locationName );

                    localStorage.setItem("userLocation", JSON.stringify( locationName )); // Save immediately
                    setUserLocation( locationName );
                    setIsFetchingLocation(false);
                    VerifyUser(passwordInput);
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
//======================================================================================================//
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
//======================================================================================================//