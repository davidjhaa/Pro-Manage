import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Analytics.module.css';

function Analytics() {
  const todos = useSelector((state) => state.todo.todos);
  const backlogs = useSelector((state) => state.backlog.backlogs);
  const inProgress = useSelector((state) => state.inProgress.inProgress);
  const done = useSelector((state) => state.done.done);

  function calculatePriorities(backlog, todo, inProgress, done) {
    const allTasks = [...backlog, ...todo, ...inProgress, ...done];
  
    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0
    };
  
    allTasks.forEach(task => {
      switch (task.priority.toLowerCase()) {
        case 'low':
          priorityCounts.low++;
          break;
        case 'moderate':
          priorityCounts.medium++;
          break;
        case 'high':
          priorityCounts.high++;
          break;
        default:
          break;
      }
    });
  
    return { priorityCounts, allTasks };
  }

  const { priorityCounts, allTasks } = calculatePriorities(backlogs, todos, inProgress, done);

  return (
      <div className={styles.head}>
        <div className={styles.heading}>Analytics</div>
        <div className={styles.main}>
          <ul className={styles.listhead}>
            <li className={styles.list}>
              <p className={styles.indentaionText}>
                <span className={styles.indentation}></span>
                <span className={styles.text}>Backlog Tasks</span>
              </p>
              <span className="value">{backlogs.length}</span>
            </li>
            <li className={styles.list}>
              <p className={styles.indentaionText}>
                <span className={styles.indentation}></span>
                <span className={styles.text}>To-Do Tasks</span>
              </p>
              <span className="value">{todos.length}</span>
            </li>
            <li className={styles.list}>
              <p className={styles.indentaionText}>
                <span className={styles.indentation}></span>
                <span className={styles.text}>In-Progress Tasks</span>
              </p>
              <span className="value">{inProgress.length}</span>
            </li>
            <li className={styles.list}>
              <p className={styles.indentaionText}>
                <span className={styles.indentation}></span>
                <span className={styles.text}>Completed Tasks</span>
              </p>
              <span className="value">{done.length}</span>
            </li>
          </ul>
          <ul className={styles.listhead}>
            <li className={styles.list}>
              <p className={styles.indentaionText}>
                <span className={styles.indentation}></span>
                <span className={styles.text}>Low Priority</span>
              </p>
              <span className="value">{priorityCounts.low}</span>
            </li>
            <li className={styles.list}>
              <p className={styles.indentaionText}>
                <span className={styles.indentation}></span>
                <span className={styles.text}>High Priority</span>
              </p>
              <span className="value">{priorityCounts.high}</span>
            </li>
            <li className={styles.list}>
              <p className={styles.indentaionText}>
                <span className={styles.indentation}></span>
                <span className={styles.text}>Medium Priority</span>
              </p>
              <span className="value">{priorityCounts.medium}</span>
            </li>
            <li className={styles.list}>
              <p className={styles.indentaionText}>
                <span className={styles.indentation}></span>
                <span className={styles.text}>Due Date Tasks</span>
              </p>
              <span className="value">{allTasks.filter(task => task.dueDate !== null).length}</span>
            </li>
          </ul>
        </div>
      </div>
  );
}

export default Analytics;
