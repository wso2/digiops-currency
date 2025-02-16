import React from "react";
import { Empty, Button } from "antd";
import { NO_RECENT_ACTIVITIES } from "../../constants/strings";
// import { useHistory } from 'react-router-dom';

const NoRecentActivities = () => {
  // const history = useHistory();

  // const handleRedirect = () => {
  //     // Example: Redirecting the user to add new activity page or a similar action.
  //     history.push('/add-activity');
  // };

  return (
    <div
      className="no-recent-activities"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "#ffffff",
        flexDirection: "column",
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ marginTop: "50px", marginBottom: "30px", color: "#ffffff" }}
        description={<span>{NO_RECENT_ACTIVITIES}</span>}
      />
      {/* <Button 
                type="primary" 
                style={{ marginTop: '20px', backgroundColor: '#1890ff', borderColor: '#1890ff' }} 
                onClick={handleRedirect}
            >
                Add New Activity
            </Button> */}
    </div>
  );
};

export default NoRecentActivities;
