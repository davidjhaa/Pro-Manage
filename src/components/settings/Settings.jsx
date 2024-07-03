import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import styles from "./Settings.module.css";
import { CiUser } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { LuEye } from "react-icons/lu";
import { FiEyeOff } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
const backendUrl = import.meta.env.VITE_Backend_URL


function Settings() {
  const navigate = useNavigate()
  const [name, setName] = useState(() => {
    const savedName = localStorage.getItem("name");
    return savedName ? JSON.parse(savedName) : "";
  });

  const [email, setEmail] = useState(() => {
    const savedEmail = localStorage.getItem("email");
    return savedEmail ? JSON.parse(savedEmail) : "";
  });

  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleSubmit = async () => {
    try {
      console.log('aaaa');
      const response = await axios.put(`${backendUrl}/user/updateUser`, {
        name: tempName,
        email: tempEmail,
        oldPassword,
        newPassword
      });
      console.log('bbbbbb');

      if (response.status === 200) {
        if(tempEmail !== email || oldPassword !== ''){
          navigate('/login');
          return;
        }
        const namee = response.data.currentAdmin.name;
        console.log(namee);
        localStorage.setItem("name", JSON.stringify(namee));
        toast.success('User updated successfully');
      } else {
        toast.error('Failed to update user');
      }
    } 
    catch (error) {
      console.error('Error updating user:', error);
      toast.error('Server error. Please try again later.');
    }
  };

  return (
    <>
      <h4 className={styles.heading}>Settings</h4>
      <form>
        <div className={styles.name}>
          <div className={styles.inputbox}>
            <label className={styles.label}>
              <CiUser />
            </label>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setTempName(e.target.value)}
              value={tempName}
              className={styles.nameInput}
            />
          </div>
        </div>
        <div className={styles.name}>
          <div className={styles.inputbox}>
            <label className={styles.label}>
              <MdOutlineMailOutline />
            </label>
            <input
              type="text"
              placeholder="Email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              className={styles.nameInput}
            />
          </div>
        </div>
        <div className={styles.name}>
          <div className={styles.inputbox}>
            <label className={styles.label}>
              <CiLock />
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={styles.nameInput}
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={toggleOldPasswordVisibility}
            >
              {showOldPassword ? <LuEye /> : <FiEyeOff />}
            </button>
          </div>
        </div>
        <div className={styles.name}>
          <div className={styles.inputbox}>
            <label className={styles.label}>
              <CiLock />
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.nameInput}
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPassword ? <LuEye /> : <FiEyeOff />}
            </button>
          </div>
        </div>
      </form>
      <button className={styles.btn} onClick={handleSubmit}>
        Update
      </button>
      <ToastContainer autoClose={1000}/>
    </>
  );
}

export default Settings;


