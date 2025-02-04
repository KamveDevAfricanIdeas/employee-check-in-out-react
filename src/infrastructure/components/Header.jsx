import Button from 'react-bootstrap/Button';
import '../../styles/header.style.css'
import ai_logo from '../../assets/AI_Logo.png'

export default function HeaderNavbar() {
  return (
    <nav className="header-navbar">

      <div className="nav-left">
        <img src={ai_logo} alt="Logo" className="logo" />
        <a href="/" className="nav-link">Home</a>
        <a href="/explore" className="nav-link">Explore</a>
      </div>

      <div className="nav-right">
        <Button variant="default" className="contact-btn">Contact Us</Button>
      </div>
    </nav>
  );
}
