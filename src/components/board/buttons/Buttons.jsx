import React, { useState } from "react";
import Delete from "../delete/Delete";
import Task from "../todo/Task";
import styles from './Buttons.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Buttons({ todo, index, toggleDropdown }) {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showTask, setShowTask] = useState(false);

  const handleEdit = () => {
    setShowTask(true);
  };

  const handleShare = () => {
    const quizLink = `${window.location.origin}/share/${todo._id}`
    navigator.clipboard.writeText(quizLink)
    toast.success("link copied succesfully");
    setTimeout(()=>{toggleDropdown(index)}, "1000")
  };

  const handleDelete = () => {
    setShowConfirmLogout(true); 
  };

  return (
    <>
      <ul className={styles.parent}>
        <button className={styles.button} onClick={()=>handleEdit()}>
          <span>Edit</span>
        </button>
        <button className={styles.button} onClick={handleShare}>
          <span>Share</span>
        </button>
        <button className={styles.delete} onClick={handleDelete}>
          <span>Delete</span>
        </button>
      </ul>
      {showConfirmLogout &&
        <Delete onClose={() => setShowConfirmLogout(false)} todo={todo} index={index} toggleDropdown={toggleDropdown}/>}
      {showTask && <Task onClose={() => setShowTask(false)} todo={todo} index={index} toggleDropdown={toggleDropdown}/>}
      <ToastContainer autoClose={1000}/>
    </>
  );
}

export default Buttons;
