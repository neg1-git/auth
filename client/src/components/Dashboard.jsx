import React, { Fragment, useState, useEffect } from "react";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

  async function getName() {
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { token: localStorage.getItem("token") } // 👈 We send the token!
      });

      const parseRes = await response.json();

      // Your backend returns: { success: true, data: { user_name: "..." } }
      // So we access it like this:
      setName(parseRes.data.user_name);
      
    } catch (err) {
      console.error(err.message);
    }
  }

  // 👇 The Logout Function
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token"); // 1. Delete token
    setAuth(false); // 2. Update App.js state (redirects to login)
  };

  useEffect(() => {
    getName();
  }, []); // Run once on load

  return (
    <Fragment>
      <h1>Dashboard</h1>
      <h3>Welcome, {name}</h3>
      <button className="btn btn-primary" onClick={(e) => logout(e)}>
        Logout
      </button>
    </Fragment>
  );
};

export default Dashboard;