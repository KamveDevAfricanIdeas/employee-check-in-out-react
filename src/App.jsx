import React, { createContext, useState, useEffect } from "react";
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import './App.css'
import LoginScreen from './infrastructure/screens/LoginScreen.jsx';
import CheckinScreen from './infrastructure/screens/CheckinScreen.jsx';
//create a context to share variables
export const EmployeeContext = createContext();
//==============================================================================================================================//
function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [userLocation, setUserLocation] = useState("");
  const [token, setToken] = useState();

  useEffect(() => {
    const savedEmployee = localStorage.getItem("selectedEmployee");
    if (savedEmployee) {
      setSelectedEmployee(JSON.parse(savedEmployee));
    }
  }, []);

  // Save selectedEmployee to localStorage whenever it changes
  useEffect(() => {
    if (selectedEmployee) {
      localStorage.setItem("selectedEmployee", JSON.stringify(selectedEmployee));
    } else {
      localStorage.removeItem("selectedEmployee");
    }
  }, [selectedEmployee]);

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    }
  }, []);
//==============================================================================================================================//
  //CHECK IF THE UNAUTHENTICATED USER HAS A TOKEN, IF NOT FETCH AND CREATE ONE.
  /* if (!token) {
    return <LoginScreen setToken={setToken}/>
  } */
  return (
    <>
      <EmployeeContext.Provider value={
        { selectedEmployee, setSelectedEmployee, userLocation, setUserLocation}}
      >
        <Router>
            <Routes>
                <Route exact path="/" element={<LoginScreen />} />
                <Route path="/checkin" element={<CheckinScreen />}  />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
      </EmployeeContext.Provider>
    </>
  )
}
export default App
//==============================================================================================================================//