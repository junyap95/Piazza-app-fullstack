import piazzaLogo from "../images/D9DEAB17-F6F0-4A3C-B4E4-069FADF7449F.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
function Header() {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    setToken(authToken);
    setIsLoggedIn(Boolean(authToken));
  }, []);

  const handleLogout = () => {
    setToken("");
    setIsLoggedIn(false);
    localStorage.removeItem("auth-token");
  };

  return (
    <div className="main-box">
      <div className="test">
        <div></div>
      </div>
      <div className="logo-box">
        <Link to="/home">
          <img className="piazza-logo" alt="piazza-logo" src={piazzaLogo} />
        </Link>
      </div>

      <nav className="nav-box">
        <ul className="nav-bar">
          {isLoggedIn ? (
            <Link type="button" onClick={handleLogout} to="/login">
              Logout
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
          {/* <Link to="/login">Login</Link> */}
          <Link to="/register">Register</Link>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
