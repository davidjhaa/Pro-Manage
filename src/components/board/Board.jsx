import React, {useState, useEffect} from "react";
import Addpeople from "../addPeople/Addpeople";
import Backlog from "./backlog/Backlog";
import Todo from "./todo/Todo";
import Progress from "./progress/Progress";
import Done from "./done/Done";
import styles from "./Board.module.css";
import { GoPeople } from "react-icons/go";
import { useDispatch } from "react-redux";
import axios from 'axios'
import { setBacklog } from "../../redux/backlogSlice";
import { setTodos } from "../../redux/todoSlice";
import { setInProgress } from "../../redux/inprogressSlice";
import { setDone } from "../../redux/doneSlice";
const backendUrl = import.meta.env.VITE_Backend_URL;

function Board() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const[openAddPeople, setOpenAddPeople] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = JSON.parse(localStorage.getItem("email"));
        axios.defaults.headers.common["Authorization"] = token;

        const response = await axios.get(`${backendUrl}/task/getAllTask`, {email});

        const data = response.data;
        dispatch(setTodos(data.todos));
        dispatch(setInProgress(data.inProgress));
        dispatch(setBacklog(data.backlog));
        dispatch(setDone(data.done));
      } 
      catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, []);

  useEffect(() => {
    const storedName = JSON.parse(localStorage.getItem("name"));
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }
  
  const today = new Date();
  const formattedDate = formatDate(today);
  
  return (
    <>
    <div className={styles.board}>
      <div className={styles.header}>
        <h3 className={styles.greet}>Welcome!  &nbsp;{name}</h3>
        <span>{formattedDate}</span>
      </div>
      <div className={styles.titleContainer}>
        <div className={styles.left}>
          <h2 className={styles.title}>Board</h2>
          <div className={styles.addpeople} onClick={()=> setOpenAddPeople(true)}>
            <GoPeople /> 
            <span>Add People</span>
          </div>
          {openAddPeople && <Addpeople setOpenAddPeople={setOpenAddPeople}/>}
        </div>
        <select name="filter" className={styles.filter}>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      <div className={styles.body}>
        <div className={styles.boardContainer}>
          <div className={styles.column}>
            <Backlog />
          </div>
          <div className={styles.column}>
            <Todo />
          </div>
          <div className={styles.column}>
            <Progress />
          </div>
          <div className={styles.column}>
            <Done />
          </div>
        </div>  
      </div>
    </div>
    </>
  );
}

export default Board;
