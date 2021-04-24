import React, { useContext } from "react";

import { AuthContext } from "../context/auth";

import "./Dashboard.scss";

function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
