import Button from 'react-bootstrap/Button';
import '../../styles/header.style.css'
import ai_logo from '../../assets/AI_Logo.png'

export default function HeaderNavbar({ username }) {
  return (
    <nav className="header-navbar">

      <div className="nav-left">
        <img src={ai_logo} alt="Logo" className="logo" />
        <p>Welcome, {username}!</p>
      </div>

      <div className="nav-right">
        <Button variant="default" className="logout-btn">Logout</Button>
      </div>
    </nav>
  );
}
