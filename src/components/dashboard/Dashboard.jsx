import styles from "./Dashboard.module.css";
import Sidebar from "../sidebar/sidebar";
import Board from "../board/Board";
import Analytics from "../analytics/Analytics";
import Settings from "../settings/Settings";
import { useSelector } from "react-redux";
import { selectComponent } from "../../redux/componentSlice";

const Dashboard = () => {
  const activeComponent = useSelector(selectComponent);

  const renderComponent = () => {
    switch (activeComponent) {
      case "board":
        return <Board className={styles.mainContentBoard} />;
      case "analytics":
        return (
            <Analytics className={styles.mainContentAnalytics}/>
        );
      case "settings":
        return <div className={styles.settings}><Settings/> </div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      {renderComponent()}
    </div>
  );
};

export default Dashboard;