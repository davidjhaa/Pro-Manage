import styles from "./Delete.module.css";
import axios from "axios";
const backendUrl = import.meta.env.VITE_Backend_URL;

function Delete({ onClose, todo, index, toggleDropdown }) {
  const handleDelete = async () => {
    console.log(todo);
    console.log("delete called");
    await axios.delete(`${backendUrl}/task/deleteTask/${todo._id}`);
    toggleDropdown(index);
    onClose();
  };

  const handleCancel = () => {
    toggleDropdown(index);
    onClose();
  };

  return (
    <div className={styles.parent}>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <p>Are you sure you want to, Delete</p>
            <div className={styles.confirm}>
              <button className={styles.yes} onClick={() => handleDelete()}>
                Yes, Delete
              </button>
              <button className={styles.no} onClick={() => handleCancel()}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delete;
