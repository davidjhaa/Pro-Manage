import {React, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Logout.module.css'

function Logout({onClose}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
      };

  return (
    <div className={styles.parent}>
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <p>Are you sure you want to, Logout</p>
                    <div className={styles.confirm}>
                        <button className={styles.yes} onClick={()=> handleLogout()}>Yes, Logout</button>
                        <button className={styles.no} onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Logout