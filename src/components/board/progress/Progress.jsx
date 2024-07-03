import React, { useState, useEffect } from "react";
import Buttons from "../buttons/Buttons";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Progress.module.css";
import { VscCollapseAll } from "react-icons/vsc";
import { BsThreeDots } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { RiArrowUpSLine } from "react-icons/ri";
import { removeInProgress } from "../../../redux/inprogressSlice";
import { addTodo } from "../../../redux/todoSlice";
import { addBacklog } from "../../../redux/backlogSlice";
import { addDone } from "../../../redux/doneSlice";
import axios from "axios";
const backendUrl = import.meta.env.VITE_Backend_URL;

const Progress = () => {
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const inProgress = useSelector((state) => state.inProgress.inProgress);
  const dispatch = useDispatch();

  const [collapsedStates, setCollapsedStates] = useState(
    inProgress.map(() => true)
  );

  useEffect(() => {
    setCollapsedStates(inProgress.map(() => true));
  }, [inProgress.length]);

  const toggleCollapse = (index) => {
    setCollapsedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const collapseAll = () => {
    setCollapsedStates(inProgress.map(() => true));
  };

  const toggleDropdown = (index) => {
    setVisibleDropdownIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const handleMoveTask = async (task, index, toState) => {
    dispatch(removeInProgress(index));
    await axios.put(`${backendUrl}/task/updateStatus`, {
      id: task._id,
      status: toState,
    });
    if (toState === "todo") {
      dispatch(addTodo(task));
    }
    if (toState === "backlog") {
      dispatch(addBacklog(task));
    } else if (toState === "done") {
      dispatch(addDone(task));
    }
  };

  return (
    <>
      <div className={styles.parent}>
        <div className={styles.heading}>
          <h3>In Progress</h3>
          <span className={styles.icons}>
            <VscCollapseAll className={styles.plus} onClick={collapseAll} />
          </span>
        </div>
        {inProgress.map((todo, index) => (
          <div key={index} className={styles.task}>
            <div className={styles.priority}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div className={styles[todo.priority]}></div>
                <span className={styles.pr}>{todo.priority} PRIORITY</span>
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
              <span>{todo.title}</span>
            </p>
            <div className={styles.checklistToggle}>
              <p className="checklist-head">
                <span>Checklist</span>{" "}
                <span className="checklist-detail">
                  (
                  {(todo.subTask || []).filter((item) => item.completed).length}{" "}
                  / {(todo.subTask || []).length})
                </span>
              </p>
              <button
                className={styles.toggleCollapse}
                onClick={() => toggleCollapse(index)}
              >
                {collapsedStates[index] ? (
                  <FaChevronDown />
                ) : (
                  <RiArrowUpSLine />
                )}
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
                      onChange={() =>
                        dispatch(
                          toggleChecklistItem({
                            todoIndex: index,
                            checklistIndex,
                          })
                        )
                      }
                    />
                    <p className={styles.subtask}>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
            <div
              className={`${styles.status} ${
                todo.dueDate !== null ? styles.spaceBetween : styles.flexEnd
              }`}
            >
              {todo.dueDate !== null && (
                <span
                  className={`${styles.date} ${
                    new Date(todo.dueDate) < new Date()
                      ? styles.datePassed
                      : styles.dateUpcoming
                  }`}
                >
                  {new Date(todo.dueDate).toLocaleDateString(undefined, {
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
                  onClick={() => handleMoveTask(todo, index, "todo")}
                  className={styles.change}
                >
                  TO DO
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
      </div>
    </>
  );
};

export default Progress;
