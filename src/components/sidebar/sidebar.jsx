import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { IoSettingsOutline } from "react-icons/io5";
import { GoDatabase } from "react-icons/go";
import { PiNotebook } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { selectComponent, setComponent } from "../../redux/componentSlice";
import logo from "../../assets/logo.svg";
import { useState, useEffect } from "react";
import Logout from "../logout/Logout";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeComponent = useSelector(selectComponent);
  const [logout, setLogout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId); 
  }, []);

  const handleButtonClick = (buttonName) => {
    dispatch(setComponent(buttonName));
    navigate(`/${buttonName}`);
  };

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      setLogout(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.nav}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
            <p className={styles.name}>Pro Manage</p>
          </div>
          <div className={styles.links}>
            <div
              className={`${styles.link} ${
                activeComponent === "board" ? styles.active : ""
              }`}
              onClick={() => handleButtonClick("board")}
            >
              <PiNotebook className={styles.icon} />
              <span className={styles.text}>Board</span>
            </div>

            <div
              className={`${styles.link} ${
                activeComponent === "analytics" ? styles.active : ""
              }`}
              onClick={() => handleButtonClick("analytics")}
            >
              <GoDatabase className={styles.icon} />
              <span>Analytics</span>
            </div>

            <div
              className={`${styles.link} ${
                activeComponent === "settings" ? styles.active : ""
              }`}
              onClick={() => handleButtonClick("settings")}
            >
              <IoSettingsOutline className={styles.icon} />
              <span>Settings</span>
            </div>
          </div>
        </div>

        <button className={styles.logout} onClick={handleAuthButtonClick}>
          <HiOutlineLogout className={styles.logoutbtn} />
          <span>{isLoggedIn ? "Logout" : "Login"}</span>
        </button>
      </div>
      {logout && <Logout onClose={() => setLogout(false)} />}
    </>
  );
};

export default Sidebar;
