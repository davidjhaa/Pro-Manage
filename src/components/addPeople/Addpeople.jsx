import { useState } from "react";
import styles from "./Addpeople.module.css";
import axios from "axios";
const backendUrl = import.meta.env.VITE_Backend_URL;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Addpeople({ setOpenAddPeople }) {
  const [email, setEmail] = useState(null);
  const [confirm, setConfirm] = useState(false);

  const handleAdd = async () => {
    if(!email){
      toast.error('Please enter a valid email')
    }
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(`${backendUrl}/user/addpeople`,{person : email});
    if(response.status === 200){
      setConfirm(true)
    }
    else if(response.status === 409)
      toast.error('Email already added')
  };

  const handleAdded = () =>{
    setConfirm(false)
    setEmail('');
  }

  return (
    <div className={styles.parent}>
      <div className={styles.main}>
        {!confirm ?
          <div className={styles.content}>
            <p>Add people to the board</p>
            <input
              className={styles.assign}
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter the Email"
            ></input>
            <div className={styles.confirm}>
              <button
                className={styles.no}
                onClick={() => setOpenAddPeople(false)}
              >
                Cancel
              </button>
              <button className={styles.yes} onClick={() => handleAdd()}>
                Add email
              </button>
            </div>
          </div>
          :
          <div className={styles.added}>
            <p>{email} added to board</p>
            <div className={styles.okay} onClick={()=> handleAdded()}>
                Okay, got it!
            </div>
          </div>
        }
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default Addpeople;
