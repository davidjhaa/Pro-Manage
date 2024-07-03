import React, { useState, useEffect } from "react";
import Buttons from "../buttons/Buttons";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Todo.module.css";
import { FaAngleDown } from "react-icons/fa6";
import { VscCollapseAll } from "react-icons/vsc";
import { FiPlus } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { RiArrowUpSLine } from "react-icons/ri";
import Task from "./Task";
import { toggleChecklistItem, removeTodo } from "../../../redux/todoSlice";
import { addBacklog } from "../../../redux/backlogSlice";
import { addInProgress } from "../../../redux/inprogressSlice";
import { addDone } from "../../../redux/doneSlice";
import axios from "axios";
const backendUrl = import.meta.env.VITE_Backend_URL;

const Todo = ({filter}) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const todos = useSelector((state) => state.todo.todos || []);
  const [filteredTodo, setFilteredTodo] = useState(todos);
  const dispatch = useDispatch();
  const [collapsedStates, setCollapsedStates] = useState([]);

  const filterBacklogs = (backlogs, filter) => {
    const now = new Date();
    return backlogs.filter((task) => {
      const taskCreationDate = new Date(task.createdAt);
      switch (filter) {
        case "today":
          return taskCreationDate.toDateString() === now.toDateString();
        case "week":
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
          return taskCreationDate >= startOfWeek && taskCreationDate <= endOfWeek;
        case "month":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return taskCreationDate >= startOfMonth && taskCreationDate <= endOfMonth;
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    if (filter) {
      setFilteredTodo(filterBacklogs(todos, filter));
    } else {
      setFilteredTodo(todos);
    }
  }, [todos, filter]);

  useEffect(() => {
    setCollapsedStates(todos.map(() => true));
  }, [todos.length]);

  const toggleCollapse = (index) => {
    setCollapsedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const collapseAll = () => {
    setCollapsedStates(todos.map(() => true));
  };

  const toggleDropdown = (index) => {
    setVisibleDropdownIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const handleToggleChecklistItem = async (todoIndex, checklistIndex) => {
    dispatch(toggleChecklistItem({ todoIndex, checklistIndex }));
  
    try {
      const todo = todos[todoIndex];
      const updatedChecklist = {
        completed: !todo.subTask[checklistIndex].completed,
      };
      await axios.put(`${backendUrl}/task/updateChecklist/${todo._id}/checklist/${checklistIndex}`, updatedChecklist);
    } catch (error) {
      console.error('Failed to update checklist item on the backend:', error);
    }
  };
  

  const handleMoveTask = async (task, index, toState) => {
    dispatch(removeTodo(index));
    await axios.put(`${backendUrl}/task/updateStatus`, {
      id: task._id,
      status: toState,
    });
    if (toState === "backlog") {
      dispatch(addBacklog(task));
    }
    if (toState === "inProgress") {
      dispatch(addInProgress(task));
    } else if (toState === "done") {
      dispatch(addDone(task));
    }
  };

  return (
    <>
      <div className={styles.parent}>
        <div className={styles.heading}>
          <h3>To do</h3>
          <span className={styles.icons}>
            <FiPlus
              className={styles.plus}
              onClick={() => setIsOverlayVisible(true)}
            />
            <VscCollapseAll className={styles.plus} onClick={collapseAll} />
          </span>
        </div>
        {filteredTodo.map((todo, index) => (
          <div key={index} className={styles.task}>
            <div className={styles.priority}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div className={styles[todo?.priority]}></div>
                <span className={styles.pr}>{todo?.priority} PRIORITY</span>
                {todo?.assignedTo && (
                  <div
                    className={styles.assignedTo}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered
                      ? todo.assignedTo?.slice(0, 2)
                      : todo.assignedTo?.slice(0, 2)}
                    {isHovered && (
                      <div className={styles.tooltip}>{todo.assignedTo}</div>
                    )}
                  </div>
                )}
              </div>
              <BsThreeDots
                style={{ cursor: "pointer" }}
                onClick={() => toggleDropdown(index)}
              />
              {visibleDropdownIndex === index && (
                <div className={styles.dropdown}>
                  <Buttons
                    todo={todo}
                    index={index}
                    toggleDropdown={toggleDropdown}
                  />
                </div>
              )}
            </div>
            <p className={styles.title}>
              <span>{todo?.title}</span>
            </p>
            <div className={styles.checklistToggle}>
              <p className="checklist-head">
                <span>Checklist</span>{" "}
                <span className="checklist-detail">
                  (
                  {
                    (todo?.subTask || []).filter((item) => item.completed)
                      .length
                  }{" "}
                  / {(todo?.subTask || []).length})
                </span>
              </p>
              <button
                className={styles.toggleCollapse}
                onClick={() => toggleCollapse(index)}
              >
                {collapsedStates[index] ? <FaAngleDown /> : <RiArrowUpSLine />}
              </button>
            </div>
            {!collapsedStates[index] && (
              <div className={styles.checklists}>
                {(todo.subTask || []).map((item, checklistIndex) => (
                  <div key={checklistIndex} className={styles.checklist}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={item.completed}
                      onChange={() =>handleToggleChecklistItem(index, checklistIndex) }
                    />
                    <p className={styles.subtask}>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
            <div
              className={`${styles.status} ${
                todo?.dueDate !== null ? styles.spaceBetween : styles.flexEnd
              }`}
            >
              {todo?.dueDate !== null && (
                <span
                  className={`${styles.date} ${
                    new Date(todo?.dueDate) < new Date()
                      ? styles.datePassed
                      : styles.dateUpcoming
                  }`}
                >
                  {new Date(todo?.dueDate).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
              <div className={styles.statusButtons}>
                <button
                  onClick={() => handleMoveTask(todo, index, "backlog")}
                  className={styles.change}
                >
                  BACKLOG
                </button>
                <button
                  onClick={() => handleMoveTask(todo, index, "inProgress")}
                  className={styles.change}
                >
                  IN PROGRESS
                </button>
                <button
                  onClick={() => handleMoveTask(todo, index, "done")}
                  className={styles.change}
                >
                  DONE
                </button>
              </div>
            </div>
          </div>
        ))}
        {isOverlayVisible && (
          <Task onClose={() => setIsOverlayVisible(false)} />
        )}
      </div>
    </>
  );
};

export default Todo;
