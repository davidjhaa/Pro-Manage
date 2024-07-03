import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Share.module.css";
import logo from "../../assets/logo.svg";
import axios from "axios";
const backendUrl = import.meta.env.VITE_Backend_URL;

function Share() {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);

  const getTask = async () => {
    console.log(id)
    try {
      const response = await axios.get(`${backendUrl}/task/getSingleTask/${id}`);
      if (response.status === 200) {
        setTodo(response.data);
      } else {
        console.error("Failed to fetch the task");
      }
    } catch (error) {
      console.error("Error fetching the task:", error);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  if (!todo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        <img src={logo} alt="Logo" />
        <p className={styles.name}>Pro Manage</p>
      </div>
      <div className={styles.container}>
        <p className={styles.priority}>
          <div className={styles[todo.priority]}></div>
          <span>{todo.priority} PRIORITY</span>
        </p>
        <p className={styles.title}>{todo.title}</p>
        <p className={styles.checklistContainer}>
          checklist ({todo.subTask.filter(task => task.completed).length}/{todo.subTask.length})
        </p>
        <div className={styles.checklist}>
          {todo.subTask.map((item, index) => (
            <div
              key={index}
              className={styles.checklistItem}
            >
              <input
                type="checkbox"
                checked={item.completed}
                className={styles.checkBox}
                readOnly
              />
              <input
                type="text"
                className={styles.taskInput}
                value={item.description}
                readOnly
              />
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <span className={styles.text}>Due Date</span>
          <span className={styles.duedate}>{new Date(todo.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>
    </div>
  );
}

export default Share;
