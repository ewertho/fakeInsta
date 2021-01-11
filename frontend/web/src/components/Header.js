import logo from "../assets/logo.svg";
import camera from "../assets/camera.svg";
import "./Header.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div id="absolit">
      <header id="main-header">
        <div className="header-content">
          <Link to="/">
            <img src={logo} alt="InstaRocket" />
          </Link>
          <Link to="/new">
            <img src={camera} alt="Enviar publicação" />
          </Link>
        </div>
      </header>
    </div>
  );
}
