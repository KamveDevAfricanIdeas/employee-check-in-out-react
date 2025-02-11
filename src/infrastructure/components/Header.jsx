import Button from 'react-bootstrap/Button';
import '../../styles/header.style.css'
import ai_logo from '../../assets/AI_Logo.png'
import { useNavigate } from 'react-router-dom';
import { EmployeeContext } from "../../App.jsx";
import { useContext } from 'react';

export default function HeaderNavbar({ username }) {
  const navigate = useNavigate();
  const { setSelectedEmployee, setUserLocation } = useContext(EmployeeContext);

  const logoutUser = () => {
    localStorage.removeItem("selectedEmployee"); // Clear employee data
    localStorage.removeItem("userLocation"); // Clear location data
    setSelectedEmployee(null); // Reset state
    setUserLocation(null); // Reset state
    navigate("/"); // Redirect to login page
};
  return (
    <nav className="header-navbar">

      <div className="nav-left">
        <img src={ai_logo} alt="Logo" className="logo" />
        <p>Welcome, {username}!</p>
      </div>

      <div className="nav-right">
        <Button variant="default" className="logout-btn" onClick={logoutUser}>Logout</Button>
      </div>
    </nav>
  );
}
