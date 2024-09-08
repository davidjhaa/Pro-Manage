import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import styles from "./Task.module.css";
import { AiFillDelete } from "react-icons/ai";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { addTodo } from "../../../redux/todoSlice";
import { format } from "date-fns";
const backendUrl = import.meta.env.VITE_Backend_URL;

function Task({ onClose, todo, index, toggleDropdown }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [people, setPeople] = useState([]);
  const [priority, setPriority] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    priority: false,
    checklist: false,
  });

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user/getpeople`);
        if (response.status === 200) {
          setPeople(response.data);
        }
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchPeople();
  }, []);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setPriority(todo.priority);
      setChecklist(
        todo.subTask
          ? todo.subTask.map((subtask) => ({
              text: subtask.description || "",
              completed: subtask.completed || false,
            }))
          : []
      );
      setDueDate(todo.dueDate ? new Date(todo.dueDate) : null);
      setSelectedPerson(todo.assignedTo)
    }
  }, [todo]);

  const handleAddChecklistItem = () => {
    setChecklist([...checklist, { text: "", completed: false }]);
  };

  const handleDeleteChecklistItem = (index) => {
    const newChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(newChecklist);
  };

  const handleToggleCompleted = (index) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;
    setChecklist(updatedChecklist);
  };

  const handleEditTask = (index, newText) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].text = newText;
    setChecklist(updatedChecklist);
  };

  const handlePriorityChange = (selectedPriority) => {
    setPriority(selectedPriority);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    if (userId === null)  {
      toast.error("Please sign in to create a task");
      return;
    }
    if (title.trim() === "") {
      setErrors((prevErrors) => ({ ...prevErrors, title: true }));
      toast.error("Title is required");
      return;
    }
    if (priority === "") {
      setErrors((prevErrors) => ({ ...prevErrors, priority: true }));
      toast.error("Priority is required");
      return;
    }
    if (checklist.length === 0) {
      setErrors((prevErrors) => ({ ...prevErrors, checklist: true }));
      toast.error("Create at least one subtask");
      return;
    }
    if (checklist.some((subtask) => subtask.text.trim() === "")) {
      setErrors((prevErrors) => ({ ...prevErrors, checklist: true }));
      toast.error("Checklist items cannot be empty");
      return;
    }

    const newTask = {
      title,
      priority,
      subTask: checklist.map((subtask) => ({
        description: subtask.text,
        completed: subtask.completed,
      })),
      dueDate: dueDate ? dueDate.toISOString() : null,
      assignedTo: selectedPerson || null,
    };

    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;

    try {
      let response;
      if (todo) {
        response = await axios.put(
          `${backendUrl}/task/updateTask/${todo._id}`,
          newTask
        );
        console.log(typeof response.status, response);
        if (response.status === 202) {
          toast.success("Task updated successfully");
          toggleDropdown(index);
          onClose();
        }
      } else {
        response = await axios.post(`${backendUrl}/task/createTask`, newTask);
        if (response.status === 201) {
          dispatch(
            addTodo({
              ...newTask,
              id: response.data.id,
            })
          );
          toast.success("Task saved successfully");
          onClose();
        }
      }
    } catch (error) {
      toast.error("Error saving the task");
    }
  };

  const handleCancel = () => {
    if (todo) {
      toggleDropdown(index);
    }
    onClose();
  };

  const clearErrors = () => {
    setErrors({ title: false, priority: false, checklist: false });
  };

  const completedTasks = checklist.filter((item) => item.completed).length;

  const lastItemRef = useRef(null);

  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [checklist.length]);

  useEffect(() => {
    if (title.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, title: false }));
    }
    if (priority !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, priority: false }));
    }
    if (
      checklist.length > 0 &&
      checklist.every((subtask) => subtask.text.trim() !== "")
    ) {
      setErrors((prevErrors) => ({ ...prevErrors, checklist: false }));
    }
  }, [title, priority, checklist]);

  const [isOpen, setIsOpen] = useState(false);

  const handleAssignClick = (e, option) => {
    e.stopPropagation();
    setSelectedPerson(option);
    setIsOpen(false);
    console.log('Assign button clicked for', option);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.titleBox}>
              <p className={styles.titleLabel}>
                Title<span style={{ color: "red" }}>*</span>
              </p>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Task Title"
                required
                className={styles.titleInput}
                onFocus={clearErrors}
              />
              {errors.title && (
                <p className={styles.error}>Title is required</p>
              )}
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <div className={styles.priorityButtons}>
                <p style={{ fontSize: "1rem", fontWeight: "500" }}>
                  Select Priority <span style={{ color: "red" }}>*</span>
                </p>
                <div className={styles.priorityButtonContainer}>
                  <button
                    type="button"
                    className={`${styles.priorityButton} ${
                      priority === "high" ? styles.selected : ""
                    }`}
                    onClick={() => handlePriorityChange("high")}
                  >
                    <span
                      className={`${styles.priorityDot} ${styles.high}`}
                    ></span>
                    <span>HIGH PRIORITY</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.priorityButton} ${
                      priority === "moderate" ? styles.selected : ""
                    }`}
                    onClick={() => handlePriorityChange("moderate")}
                  >
                    <span
                      className={`${styles.priorityDot} ${styles.moderate}`}
                    ></span>
                    <span>MODERATE PRIORITY</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.priorityButton} ${
                      priority === "low" ? styles.selected : ""
                    }`}
                    onClick={() => handlePriorityChange("low")}
                  >
                    <span
                      className={`${styles.priorityDot} ${styles.low}`}
                    ></span>{" "}
                    <span>LOW PRIORITY</span>
                  </button>
                </div>
              </div>
              {errors.priority && (
                <p className={styles.error}>Priority is required</p>
              )}
            </div>
            <div className={styles.assign}>
              <p>Assign to</p>
              <div className={styles.selectbtncontainer}>
                <div
                  className={styles.selectedbtn}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedPerson || "Add a assignee"}
                </div>
                {isOpen && (
                  <div className={styles.selectOptionContainer}>
                    {people.map((option, index) => (
                      <div
                        key={index}
                        className={styles.selectoption}
                      >
                        <div style={{display:'flex', gap:'24px'}}>
                          <div className={styles.shorthand}>{option.slice(0, 2)}</div>  
                          {option}
                        </div>
                        <button onClick={(e) => handleAssignClick(e, option)} className={styles.assignbtn}>
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className={styles.checklistDetail}>
              Checklist ({completedTasks}/{checklist.length})
              <span style={{ color: "red", letterSpacing: "1.3px" }}>*</span>
            </p>
            <div className={styles.checklistContainer}>
              {checklist.map((item, index) => (
                <div
                  key={index}
                  className={styles.checklistItem}
                  ref={index === checklist.length - 1 ? lastItemRef : null}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleCompleted(index)}
                    className={styles.checkBox}
                  />
                  <input
                    type="text"
                    className={styles.taskInput}
                    value={item.text}
                    placeholder="Add a task"
                    onChange={(e) => handleEditTask(index, e.target.value)}
                    onFocus={clearErrors}
                  />
                  <AiFillDelete
                    className={styles.deleteButton}
                    onClick={() => handleDeleteChecklistItem(index)}
                  />
                </div>
              ))}
            </div>
            {errors.checklist && (
              <p className={styles.error}>Checklist task cannot be empty</p>
            )}
            <button
              className={styles.addNewButton}
              onClick={() => handleAddChecklistItem()}
            >
              + Add
            </button>
          </div>

          <div className={styles.formActions}>
            <div className={styles.dateButton}>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen((prev) => !prev)}
                className={styles.datebtn}
              >
                {dueDate === null ? (
                  <span>Select Due Date</span>
                ) : (
                  <span>{format(dueDate, "MM-dd-yyyy")}</span>
                )}
              </button>
              {isDatePickerOpen && (
                <div className={styles.datePickerContainer}>
                  <DatePicker
                    selected={dueDate}
                    onChange={(date) => {
                      setDueDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    dateFormat="MM/dd/yyyy"
                    inline
                  />
                </div>
              )}
            </div>
            <div className={styles.cansavebtn}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => handleCancel()}
              >
                Cancel
              </button>
              <button className={styles.saveButton} onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default Task;
