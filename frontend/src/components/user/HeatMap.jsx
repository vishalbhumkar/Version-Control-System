import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 5);
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const getPanelColors = () => ({
  0: "#161b22",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
});

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const data = generateActivityData(startDate, endDate);
    setActivityData(data);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        border: "1px solid #30363d",
        borderRadius: "6px",
        padding: "16px",
        backgroundColor: "#0d1117",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <HeatMap
          value={activityData}
          startDate={
            activityData.length ? new Date(activityData[0].date) : new Date()
          }
          endDate={
            activityData.length
              ? new Date(activityData[activityData.length - 1].date)
              : new Date()
          }
          rectSize={10}
          space={3}
          legendCellSize={0}
          weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
          monthLabels={[
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
          ]}
          panelColors={getPanelColors()}
          style={{
            color: "#8b949e",
            fontSize: "12px",
            display: "block",
            maxWidth: "100%",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          color: "#8b949e",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>Less</span>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#161b22",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#0e4429",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#006d32",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#26a641",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#39d353",
              borderRadius: "2px",
            }}
          />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMapProfile;

/* 
import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
// import axios from "axios";

const getPanelColors = () => ({
  0: "#161b22",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
});

const generateFallbackData = () => {
  const data = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 5),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const formatContributionData = (rawData = []) => {
  return rawData.map((item) => ({
    date: item.date,
    count: Number(item.count) || 0,
  }));
};

const HeatMapProfile = ({ userId }) => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const loadContributionData = async () => {
      try {
        // Future backend logic
        // const response = await axios.get(`http://localhost:3001/contributions/${userId}`);
        // const formatted = formatContributionData(response.data);
        // setActivityData(formatted);

        const fallbackData = generateFallbackData();
        setActivityData(fallbackData);
      } catch (error) {
        console.error("Error loading contribution data:", error);
        setActivityData(generateFallbackData());
      }
    };

    loadContributionData();
  }, [userId]);

  const startDate = activityData.length
    ? new Date(activityData[0].date)
    : new Date();

  const endDate = activityData.length
    ? new Date(activityData[activityData.length - 1].date)
    : new Date();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        border: "1px solid #30363d",
        borderRadius: "6px",
        padding: "16px",
        backgroundColor: "#0d1117",
        boxSizing: "border-box",
        overflowX: "auto",
      }}
    >
      <HeatMap
        value={activityData}
        startDate={startDate}
        endDate={endDate}
        rectSize={10}
        space={3}
        legendCellSize={0}
        weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
        panelColors={getPanelColors()}
        style={{
          color: "#8b949e",
          fontSize: "12px",
          display: "block",
          maxWidth: "100%",
        }}
      />

      <div
        style={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          color: "#8b949e",
          fontSize: "12px",
        }}
      >
        <span>Learn how we count contributions</span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>Less</span>
          <div style={{ width: "10px", height: "10px", backgroundColor: "#161b22", borderRadius: "2px" }} />
          <div style={{ width: "10px", height: "10px", backgroundColor: "#0e4429", borderRadius: "2px" }} />
          <div style={{ width: "10px", height: "10px", backgroundColor: "#006d32", borderRadius: "2px" }} />
          <div style={{ width: "10px", height: "10px", backgroundColor: "#26a641", borderRadius: "2px" }} />
          <div style={{ width: "10px", height: "10px", backgroundColor: "#39d353", borderRadius: "2px" }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMapProfile;
*/
