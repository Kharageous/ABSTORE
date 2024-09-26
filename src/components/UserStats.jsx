import React, { useState, useEffect } from "react";

const UserStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newRegistrations: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Fetch user statistics from the server
    const fetchStats = async () => {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Statistics</h2>
      <div className="space-y-4">
        <div>Total Users: {stats.totalUsers}</div>
        <div>New Registrations: {stats.newRegistrations}</div>
        <div>Active Users: {stats.activeUsers}</div>
      </div>
    </div>
  );
};

export default UserStats;
